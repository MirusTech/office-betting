"""User model for authentication and balance tracking."""

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from mirustech.betting.database import Base

if TYPE_CHECKING:
    from mirustech.betting.models.bet import Bet
    from mirustech.betting.models.wager import Wager


class User(Base):
    """User account with OfficeCoins balance."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    balance: Mapped[int] = mapped_column(default=1000)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC).replace(tzinfo=None))

    # Relationships
    bets_created: Mapped[list["Bet"]] = relationship(back_populates="creator")
    wagers: Mapped[list["Wager"]] = relationship(back_populates="user")
