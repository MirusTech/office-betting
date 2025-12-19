"""Wager model for tracking individual bets placed by users."""

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from mirustech.betting.database import Base

if TYPE_CHECKING:
    from mirustech.betting.models.outcome import Outcome
    from mirustech.betting.models.user import User


class Wager(Base):
    """A wager placed by a user on a specific outcome."""

    __tablename__ = "wagers"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    outcome_id: Mapped[int] = mapped_column(ForeignKey("outcomes.id"))
    amount: Mapped[int] = mapped_column()  # Amount in OfficeCoins
    weight: Mapped[float] = mapped_column(default=1.0)  # 1.0 or 1.2 for early bets
    payout: Mapped[float | None] = mapped_column(nullable=True)  # Set after resolution
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC).replace(tzinfo=None))

    # Relationships
    user: Mapped["User"] = relationship(back_populates="wagers")
    outcome: Mapped["Outcome"] = relationship(back_populates="wagers")

    @property
    def weighted_amount(self) -> float:
        """Calculate the weighted wager amount."""
        return self.amount * self.weight
