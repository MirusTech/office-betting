"""Application configuration using pydantic-settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/betting.db"

    # JWT
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 1 week

    # App
    debug: bool = False
    initial_balance: int = 1000
    minimum_wager: int = 50
    early_bet_bonus: float = 1.2

    class Config:
        env_file = ".env"
        env_prefix = "BETTING_"


settings = Settings()
