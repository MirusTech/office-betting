"""FastAPI application for the office betting platform."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from mirustech.betting.config import settings
from mirustech.betting.database import init_db
from mirustech.betting.routers import auth_router, bets_router, leaderboard_router

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler for startup/shutdown."""
    logger.info("starting_application")
    await init_db()
    logger.info("database_initialized")
    yield
    logger.info("shutting_down_application")


app = FastAPI(
    title="Office Betting Platform",
    description=(
        "A play-money pari-mutuel betting platform using OfficeCoins. "
        "This application uses virtual play money only. No real money is wagered or paid out. "
        "For entertainment purposes only."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://frontend:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(bets_router)
app.include_router(leaderboard_router)


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/config")
async def get_public_config() -> dict[str, int | float]:
    """Get public configuration values."""
    return {
        "minimum_wager": settings.minimum_wager,
        "early_bet_bonus": settings.early_bet_bonus,
        "initial_balance": settings.initial_balance,
    }
