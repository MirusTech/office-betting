"""Seed data for the betting platform."""

import asyncio
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from mirustech.betting.config import settings
from mirustech.betting.database import async_session, init_db
from mirustech.betting.models import Bet, Outcome, User
from mirustech.betting.services.auth import get_password_hash


async def seed_database() -> None:
    """Seed the database with initial users and sample bets."""
    await init_db()

    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded, skipping...")
            return

        # Create users
        users_data = [
            {"username": "alice", "password": "password123"},
            {"username": "bob", "password": "password123"},
            {"username": "charlie", "password": "password123"},
            {"username": "demo", "password": "demo"},
        ]

        users = []
        for user_data in users_data:
            user = User(
                username=user_data["username"],
                password_hash=get_password_hash(user_data["password"]),
                balance=settings.initial_balance,
            )
            db.add(user)
            users.append(user)

        await db.flush()
        print(f"Created {len(users)} users")

        # Create sample bets
        now = datetime.now(UTC)

        bets_data = [
            {
                "creator": users[0],  # alice
                "title": "Will it rain tomorrow?",
                "description": "Based on the weather forecast for our city. Resolution based on whether any measurable precipitation falls.",
                "outcomes": ["Yes", "No"],
                "close_time": now + timedelta(hours=24),
            },
            {
                "creator": users[1],  # bob
                "title": "Who wins the ping pong tournament?",
                "description": "Office ping pong tournament this Friday. Single elimination bracket.",
                "outcomes": ["Alice", "Bob", "Charlie"],
                "close_time": now + timedelta(days=3),
            },
            {
                "creator": users[2],  # charlie
                "title": "Will the deploy succeed on first try?",
                "description": "Today's production deployment. Success means no rollback needed within 1 hour.",
                "outcomes": ["Yes", "No"],
                "close_time": now + timedelta(hours=2),
            },
            {
                "creator": users[0],  # alice
                "title": "How many bugs in the next sprint?",
                "description": "Count of bug tickets created during the next two-week sprint.",
                "outcomes": ["0-5", "6-10", "11-20", "More than 20"],
                "close_time": now + timedelta(days=14),
            },
        ]

        for bet_data in bets_data:
            bet = Bet(
                creator_id=bet_data["creator"].id,
                title=bet_data["title"],
                description=bet_data["description"],
                close_time=bet_data["close_time"],
            )
            db.add(bet)
            await db.flush()

            for outcome_name in bet_data["outcomes"]:
                outcome = Outcome(bet_id=bet.id, name=outcome_name)
                db.add(outcome)

        await db.commit()
        print(f"Created {len(bets_data)} sample bets")
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
