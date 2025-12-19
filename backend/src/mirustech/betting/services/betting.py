"""Betting service with pari-mutuel odds calculation."""

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from mirustech.betting.config import settings
from mirustech.betting.models import Bet, BetStatus, Outcome, User, Wager
from mirustech.betting.schemas import BetCreate, BetDetailResponse, BetListResponse, OutcomeWithOdds


class BettingService:
    """Service for managing bets and wagers."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_bet(self, user: User, data: BetCreate) -> Bet:
        """Create a new bet with outcomes."""
        if data.close_time <= datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Close time must be in the future",
            )

        bet = Bet(
            creator_id=user.id,
            title=data.title,
            description=data.description,
            close_time=data.close_time,
        )
        self.db.add(bet)
        await self.db.flush()

        for outcome_data in data.outcomes:
            outcome = Outcome(bet_id=bet.id, name=outcome_data.name)
            self.db.add(outcome)

        await self.db.flush()
        return bet

    async def get_bet(self, bet_id: int) -> Bet | None:
        """Get a bet by ID with outcomes and wagers loaded."""
        result = await self.db.execute(
            select(Bet)
            .options(
                selectinload(Bet.outcomes).selectinload(Outcome.wagers),
                selectinload(Bet.creator),
            )
            .where(Bet.id == bet_id)
        )
        return result.scalar_one_or_none()

    async def list_bets(self, status_filter: BetStatus | None = None) -> list[Bet]:
        """List all bets, optionally filtered by status."""
        query = select(Bet).options(
            selectinload(Bet.outcomes).selectinload(Outcome.wagers),
            selectinload(Bet.creator),
        )
        if status_filter:
            query = query.where(Bet.status == status_filter)
        query = query.order_by(Bet.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def place_wager(self, user: User, bet_id: int, outcome_id: int, amount: int) -> Wager:
        """Place a wager on an outcome."""
        bet = await self.get_bet(bet_id)
        if not bet:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bet not found")

        if not bet.is_open:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bet is no longer accepting wagers",
            )

        # Find the outcome
        outcome = next((o for o in bet.outcomes if o.id == outcome_id), None)
        if not outcome:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outcome not found")

        # Check minimum wager
        if amount < settings.minimum_wager:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum wager is {settings.minimum_wager} OfficeCoins",
            )

        # Check balance
        if user.balance < amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient balance",
            )

        # Calculate weight (early bet bonus)
        weight = self._calculate_weight(bet)

        # Create wager and deduct balance
        wager = Wager(
            user_id=user.id,
            outcome_id=outcome_id,
            amount=amount,
            weight=weight,
        )
        user.balance -= amount

        self.db.add(wager)
        await self.db.flush()
        return wager

    def _calculate_weight(self, bet: Bet) -> float:
        """Calculate the weight multiplier for early bets."""
        now = datetime.utcnow()
        total_window = (bet.close_time - bet.created_at).total_seconds()
        elapsed = (now - bet.created_at).total_seconds()

        # Early bet bonus if within first 50% of window
        if elapsed < total_window / 2:
            return settings.early_bet_bonus
        return 1.0

    def calculate_odds(self, bet: Bet) -> list[OutcomeWithOdds]:
        """Calculate odds for all outcomes in a bet."""
        total_pool = bet.total_pool
        outcomes_with_odds = []

        for outcome in bet.outcomes:
            weighted_total = outcome.weighted_total

            if weighted_total > 0 and total_pool > 0:
                # Odds = how much you'd get per 1 coin wagered (weighted)
                odds = total_pool / weighted_total
                payout_multiplier = odds
            else:
                odds = 0
                payout_multiplier = 0

            outcomes_with_odds.append(
                OutcomeWithOdds(
                    id=outcome.id,
                    name=outcome.name,
                    pool_total=outcome.pool_total,
                    weighted_total=weighted_total,
                    odds=round(odds, 2),
                    payout_multiplier=round(payout_multiplier, 2),
                )
            )

        return outcomes_with_odds

    def to_list_response(self, bet: Bet) -> BetListResponse:
        """Convert a bet to list response format."""
        return BetListResponse(
            id=bet.id,
            title=bet.title,
            description=bet.description,
            close_time=bet.close_time,
            status=bet.status,
            created_at=bet.created_at,
            creator_username=bet.creator.username,
            total_pool=bet.total_pool,
            outcome_count=len(bet.outcomes),
        )

    def to_detail_response(self, bet: Bet) -> BetDetailResponse:
        """Convert a bet to detail response format."""
        outcomes_with_odds = self.calculate_odds(bet)

        # Calculate if we're still in the early betting window
        now = datetime.utcnow()
        total_window = (bet.close_time - bet.created_at).total_seconds()
        elapsed = (now - bet.created_at).total_seconds()
        is_early_betting = elapsed < total_window / 2 and bet.is_open

        return BetDetailResponse(
            id=bet.id,
            title=bet.title,
            description=bet.description,
            close_time=bet.close_time,
            status=bet.status,
            created_at=bet.created_at,
            creator_id=bet.creator_id,
            creator_username=bet.creator.username,
            total_pool=bet.total_pool,
            outcomes=outcomes_with_odds,
            winning_outcome_id=bet.winning_outcome_id,
            is_early_betting=is_early_betting,
        )
