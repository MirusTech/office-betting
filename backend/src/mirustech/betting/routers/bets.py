"""Betting routes for creating, viewing, and managing bets."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from mirustech.betting.database import get_db
from mirustech.betting.models import BetStatus, Outcome, User, Wager
from mirustech.betting.schemas import (
    BetCreate,
    BetDetailResponse,
    BetListResponse,
    BetResolve,
    WagerCreate,
    WagerResponse,
)
from mirustech.betting.services.auth import get_current_user
from mirustech.betting.services.betting import BettingService
from mirustech.betting.services.payout import PayoutService

router = APIRouter(prefix="/api/bets", tags=["bets"])


@router.get("", response_model=list[BetListResponse])
async def list_bets(
    db: Annotated[AsyncSession, Depends(get_db)],
    status_filter: BetStatus | None = Query(None, alias="status"),
) -> list[BetListResponse]:
    """List all bets, optionally filtered by status."""
    service = BettingService(db)

    # First close any expired bets
    payout_service = PayoutService(db)
    await payout_service.close_expired_bets()

    bets = await service.list_bets(status_filter)
    return [service.to_list_response(bet) for bet in bets]


@router.post("", response_model=BetDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_bet(
    data: BetCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> BetDetailResponse:
    """Create a new bet."""
    service = BettingService(db)
    bet = await service.create_bet(current_user, data)
    # Re-fetch to load relationships
    bet = await service.get_bet(bet.id)
    if not bet:
        raise HTTPException(status_code=500, detail="Failed to create bet")
    return service.to_detail_response(bet)


@router.get("/{bet_id}", response_model=BetDetailResponse)
async def get_bet(
    bet_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BetDetailResponse:
    """Get detailed bet information including odds."""
    service = BettingService(db)

    # First close if expired
    payout_service = PayoutService(db)
    await payout_service.close_expired_bets()

    bet = await service.get_bet(bet_id)
    if not bet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bet not found")
    return service.to_detail_response(bet)


@router.post("/{bet_id}/wager", response_model=WagerResponse, status_code=status.HTTP_201_CREATED)
async def place_wager(
    bet_id: int,
    data: WagerCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> WagerResponse:
    """Place a wager on a bet outcome."""
    service = BettingService(db)
    wager = await service.place_wager(current_user, bet_id, data.outcome_id, data.amount)

    # Fetch outcome and bet info for response
    result = await db.execute(
        select(Wager)
        .options(selectinload(Wager.outcome).selectinload(Outcome.bet))
        .where(Wager.id == wager.id)
    )
    wager = result.scalar_one()

    return WagerResponse(
        id=wager.id,
        outcome_id=wager.outcome_id,
        outcome_name=wager.outcome.name,
        bet_id=wager.outcome.bet_id,
        bet_title=wager.outcome.bet.title,
        amount=wager.amount,
        weight=wager.weight,
        payout=wager.payout,
        created_at=wager.created_at,
    )


@router.post("/{bet_id}/resolve", response_model=BetDetailResponse)
async def resolve_bet(
    bet_id: int,
    data: BetResolve,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> BetDetailResponse:
    """Resolve a bet by selecting the winning outcome."""
    payout_service = PayoutService(db)
    bet = await payout_service.resolve_bet(bet_id, data.winning_outcome_id, current_user)

    service = BettingService(db)
    return service.to_detail_response(bet)


@router.get("/users/me/wagers", response_model=list[WagerResponse])
async def get_my_wagers(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[WagerResponse]:
    """Get all wagers placed by the current user."""
    result = await db.execute(
        select(Wager)
        .options(selectinload(Wager.outcome).selectinload(Outcome.bet))
        .where(Wager.user_id == current_user.id)
        .order_by(Wager.created_at.desc())
    )
    wagers = result.scalars().all()

    return [
        WagerResponse(
            id=w.id,
            outcome_id=w.outcome_id,
            outcome_name=w.outcome.name,
            bet_id=w.outcome.bet_id,
            bet_title=w.outcome.bet.title,
            amount=w.amount,
            weight=w.weight,
            payout=w.payout,
            created_at=w.created_at,
        )
        for w in wagers
    ]
