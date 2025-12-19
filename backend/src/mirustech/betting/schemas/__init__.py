"""Pydantic schemas for API request/response validation."""

from mirustech.betting.schemas.auth import Token, UserCreate, UserLogin, UserResponse
from mirustech.betting.schemas.bet import (
    BetCreate,
    BetDetailResponse,
    BetListResponse,
    BetResolve,
    OutcomeResponse,
    OutcomeWithOdds,
)
from mirustech.betting.schemas.wager import WagerCreate, WagerResponse

__all__ = [
    "Token",
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "BetCreate",
    "BetListResponse",
    "BetDetailResponse",
    "BetResolve",
    "OutcomeResponse",
    "OutcomeWithOdds",
    "WagerCreate",
    "WagerResponse",
]
