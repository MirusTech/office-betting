"""Payout service for resolving bets and distributing winnings."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from mirustech.betting.models import Bet, BetStatus, Outcome, User, Wager


class PayoutService:
    """Service for resolving bets and calculating payouts."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def resolve_bet(self, bet_id: int, winning_outcome_id: int, resolver: User) -> Bet:
        """Resolve a bet by selecting the winning outcome and distributing payouts."""
        # Load bet with all relationships
        result = await self.db.execute(
            select(Bet)
            .options(
                selectinload(Bet.outcomes).selectinload(Outcome.wagers).selectinload(Wager.user),
                selectinload(Bet.creator),
            )
            .where(Bet.id == bet_id)
        )
        bet = result.scalar_one_or_none()

        if not bet:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bet not found")

        # Only creator can resolve
        if bet.creator_id != resolver.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the bet creator can resolve this bet",
            )

        # Check bet status
        if bet.status == BetStatus.RESOLVED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bet has already been resolved",
            )

        # Find winning outcome
        winning_outcome = next((o for o in bet.outcomes if o.id == winning_outcome_id), None)
        if not winning_outcome:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid winning outcome",
            )

        # Calculate and distribute payouts
        total_pool = bet.total_pool
        winning_weighted_total = winning_outcome.weighted_total

        if winning_weighted_total > 0:
            for wager in winning_outcome.wagers:
                # payout = (user_weighted_wager / total_weighted_on_winner) * total_pool
                user_weighted = wager.amount * wager.weight
                payout = (user_weighted / winning_weighted_total) * total_pool
                payout = int(payout)  # Round down to whole coins

                wager.payout = payout
                wager.user.balance += payout

        # Mark losing wagers with 0 payout
        for outcome in bet.outcomes:
            if outcome.id != winning_outcome_id:
                for wager in outcome.wagers:
                    wager.payout = 0

        # Update bet status
        bet.status = BetStatus.RESOLVED
        bet.winning_outcome_id = winning_outcome_id

        await self.db.flush()
        return bet

    async def close_expired_bets(self) -> int:
        """Close all bets that have passed their close time."""
        from datetime import datetime

        result = await self.db.execute(
            select(Bet).where(
                Bet.status == BetStatus.OPEN,
                Bet.close_time <= datetime.utcnow(),
            )
        )
        bets = result.scalars().all()

        count = 0
        for bet in bets:
            bet.status = BetStatus.CLOSED
            count += 1

        await self.db.flush()
        return count
