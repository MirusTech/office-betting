"""Authentication routes for login, registration, and user info."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from mirustech.betting.config import settings
from mirustech.betting.database import get_db
from mirustech.betting.models import User
from mirustech.betting.schemas import Token, UserCreate, UserResponse
from mirustech.betting.services.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Register a new user with initial OfficeCoins balance."""
    # Check if username exists
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    user = User(
        username=data.username,
        password_hash=get_password_hash(data.password),
        balance=settings.initial_balance,
    )
    db.add(user)
    await db.flush()
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Token:
    """Login and get an access token."""
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get current user info including balance."""
    return current_user
