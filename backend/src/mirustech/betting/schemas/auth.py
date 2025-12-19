"""Authentication schemas for login, registration, and user info."""

from datetime import datetime

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    """Schema for user registration."""

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login."""

    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for user info response."""

    id: int
    username: str
    balance: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"
