"""Leaderboard routes for viewing top users."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from mirustech.betting.database import get_db
from mirustech.betting.models import User

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


class LeaderboardEntry(BaseModel):
    """Schema for leaderboard entry."""

    rank: int
    username: str
    balance: int

    class Config:
        from_attributes = True


@router.get("", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(default=10, ge=1, le=100),
) -> list[LeaderboardEntry]:
    """Get the top users by balance."""
    result = await db.execute(
        select(User).order_by(User.balance.desc()).limit(limit)
    )
    users = result.scalars().all()

    return [
        LeaderboardEntry(rank=i + 1, username=user.username, balance=user.balance)
        for i, user in enumerate(users)
    ]
