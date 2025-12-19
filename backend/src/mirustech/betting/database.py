"""Database connection and session management."""

from collections.abc import AsyncGenerator
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from mirustech.betting.config import settings


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


# Ensure data directory exists
data_dir = Path("./data")
data_dir.mkdir(exist_ok=True)

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides a database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """Initialize the database by creating all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
