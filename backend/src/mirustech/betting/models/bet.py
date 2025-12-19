"""Bet model for tracking betting events."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from mirustech.betting.database import Base

if TYPE_CHECKING:
    from mirustech.betting.models.outcome import Outcome
    from mirustech.betting.models.user import User


class BetStatus(enum.Enum):
    """Status of a bet."""

    OPEN = "open"
    CLOSED = "closed"
    RESOLVED = "resolved"


class Bet(Base):
    """A betting event with multiple outcomes."""

    __tablename__ = "bets"

    id: Mapped[int] = mapped_column(primary_key=True)
    creator_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    close_time: Mapped[datetime] = mapped_column()
    status: Mapped[BetStatus] = mapped_column(Enum(BetStatus), default=BetStatus.OPEN)
    winning_outcome_id: Mapped[int | None] = mapped_column(ForeignKey("outcomes.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    creator: Mapped["User"] = relationship(back_populates="bets_created")
    outcomes: Mapped[list["Outcome"]] = relationship(
        back_populates="bet",
        foreign_keys="Outcome.bet_id",
    )

    @property
    def is_open(self) -> bool:
        """Check if the bet is still accepting wagers."""
        return self.status == BetStatus.OPEN and datetime.utcnow() < self.close_time

    @property
    def total_pool(self) -> float:
        """Calculate the total amount wagered on all outcomes."""
        return sum(outcome.pool_total for outcome in self.outcomes)
