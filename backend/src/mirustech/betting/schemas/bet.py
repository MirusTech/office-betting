"""Bet schemas for creating, listing, and viewing bets."""

from datetime import datetime

from pydantic import BaseModel, Field

from mirustech.betting.models.bet import BetStatus


class OutcomeCreate(BaseModel):
    """Schema for creating an outcome."""

    name: str = Field(..., min_length=1, max_length=100)


class BetCreate(BaseModel):
    """Schema for creating a new bet."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    outcomes: list[OutcomeCreate] = Field(..., min_length=2)
    close_time: datetime


class OutcomeResponse(BaseModel):
    """Schema for outcome in responses."""

    id: int
    name: str
    pool_total: float

    class Config:
        from_attributes = True


class OutcomeWithOdds(BaseModel):
    """Schema for outcome with calculated odds."""

    id: int
    name: str
    pool_total: float
    weighted_total: float
    odds: float
    payout_multiplier: float


class BetListResponse(BaseModel):
    """Schema for bet in list view."""

    id: int
    title: str
    description: str
    close_time: datetime
    status: BetStatus
    created_at: datetime
    creator_username: str
    total_pool: float
    outcome_count: int

    class Config:
        from_attributes = True


class BetDetailResponse(BaseModel):
    """Schema for detailed bet view with outcomes and odds."""

    id: int
    title: str
    description: str
    close_time: datetime
    status: BetStatus
    created_at: datetime
    creator_id: int
    creator_username: str
    total_pool: float
    outcomes: list[OutcomeWithOdds]
    winning_outcome_id: int | None
    is_early_betting: bool


class BetResolve(BaseModel):
    """Schema for resolving a bet."""

    winning_outcome_id: int
