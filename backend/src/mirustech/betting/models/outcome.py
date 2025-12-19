"""Outcome model for possible results of a bet."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from mirustech.betting.database import Base

if TYPE_CHECKING:
    from mirustech.betting.models.bet import Bet
    from mirustech.betting.models.wager import Wager


class Outcome(Base):
    """A possible outcome for a bet."""

    __tablename__ = "outcomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    bet_id: Mapped[int] = mapped_column(ForeignKey("bets.id"))
    name: Mapped[str] = mapped_column(String(100))

    # Relationships
    bet: Mapped["Bet"] = relationship(back_populates="outcomes", foreign_keys=[bet_id])
    wagers: Mapped[list["Wager"]] = relationship(back_populates="outcome")

    @property
    def pool_total(self) -> float:
        """Sum of all wager amounts on this outcome."""
        return sum(wager.amount for wager in self.wagers)

    @property
    def weighted_total(self) -> float:
        """Sum of weighted wagers on this outcome."""
        return sum(wager.amount * wager.weight for wager in self.wagers)
