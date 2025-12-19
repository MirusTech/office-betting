"""Wager schemas for placing and viewing wagers."""

from datetime import datetime

from pydantic import BaseModel, Field

from mirustech.betting.config import settings


class WagerCreate(BaseModel):
    """Schema for placing a wager."""

    outcome_id: int
    amount: int = Field(..., ge=settings.minimum_wager)


class WagerResponse(BaseModel):
    """Schema for wager in responses."""

    id: int
    outcome_id: int
    outcome_name: str
    bet_id: int
    bet_title: str
    amount: int
    weight: float
    payout: float | None
    created_at: datetime

    class Config:
        from_attributes = True
