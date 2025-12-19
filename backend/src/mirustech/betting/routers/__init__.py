"""API routers for the betting platform."""

from mirustech.betting.routers.auth import router as auth_router
from mirustech.betting.routers.bets import router as bets_router
from mirustech.betting.routers.leaderboard import router as leaderboard_router

__all__ = ["auth_router", "bets_router", "leaderboard_router"]
