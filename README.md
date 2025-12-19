# Office Betting Platform

A play-money pari-mutuel betting platform using **OfficeCoins** virtual currency.

> **DISCLAIMER**: This application uses virtual play money only. No real money is wagered or paid out. For entertainment purposes only.

## Quick Start

```bash
docker-compose up --build
```

Then open http://localhost:3000 in your browser.

## Demo Accounts

| Username | Password | Starting Balance |
|----------|----------|------------------|
| demo | demo | 1,000 OfficeCoins |
| alice | password123 | 1,000 OfficeCoins |
| bob | password123 | 1,000 OfficeCoins |
| charlie | password123 | 1,000 OfficeCoins |

## Features

### Betting
- **Create bets** with any number of outcomes (minimum 2)
- **Pari-mutuel odds** that update after each wager
- **Early bet bonus**: Wagers in the first 50% of the betting window get 1.2x weight
- **Live countdown timers** until betting closes
- **Minimum wager**: 50 OfficeCoins

### Users
- Register with username/password
- Each new user starts with 1,000 OfficeCoins
- View personal wager history and statistics
- Balance-based leaderboard

### Payouts
- Bet creators resolve bets by selecting the winning outcome
- Winners split the total pool proportionally based on weighted wagers
- Payout formula: `(user_weighted_wager / total_weighted_on_winner) * total_pool`

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI + Python 3.12 |
| Database | SQLite (file-based) |
| ORM | SQLAlchemy 2.0 |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Auth | JWT tokens |
| Container | Docker Compose |

## Project Structure

```
office-betting/
├── docker-compose.yml       # One-command startup
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── data/                # SQLite database (created on startup)
│   └── src/mirustech/betting/
│       ├── main.py          # FastAPI app
│       ├── config.py        # Settings
│       ├── database.py      # SQLAlchemy setup
│       ├── models/          # Database models
│       ├── schemas/         # Pydantic schemas
│       ├── routers/         # API routes
│       ├── services/        # Business logic
│       └── seed.py          # Seed data
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── api/             # API client
        ├── components/      # React components
        ├── pages/           # Page components
        ├── hooks/           # Custom hooks
        └── types/           # TypeScript types
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Current user info

### Bets
- `GET /api/bets` - List all bets (filterable by status)
- `POST /api/bets` - Create new bet
- `GET /api/bets/{id}` - Get bet details with odds
- `POST /api/bets/{id}/wager` - Place a wager
- `POST /api/bets/{id}/resolve` - Resolve bet (creator only)

### Users
- `GET /api/bets/users/me/wagers` - User's wager history
- `GET /api/leaderboard` - Top users by balance

## Development Setup

### Backend (without Docker)

```bash
cd backend
uv pip install -e .
uvicorn mirustech.betting.main:app --reload

# Seed data
python -m mirustech.betting.seed
```

### Frontend (without Docker)

```bash
cd frontend
npm install
npm run dev
```

## Configuration

Environment variables (can be set in docker-compose.yml):

| Variable | Default | Description |
|----------|---------|-------------|
| `BETTING_DATABASE_URL` | `sqlite+aiosqlite:///./data/betting.db` | Database connection |
| `BETTING_JWT_SECRET_KEY` | `dev-secret-key...` | JWT signing key |
| `BETTING_INITIAL_BALANCE` | `1000` | Starting coins for new users |
| `BETTING_MINIMUM_WAGER` | `50` | Minimum wager amount |
| `BETTING_EARLY_BET_BONUS` | `1.2` | Weight multiplier for early bets |

## Assumptions & Design Decisions

1. **No real-time updates**: Users refresh to see odds changes (simpler than WebSockets)
2. **Single resolution**: Only the bet creator can resolve their bet
3. **No disputes**: Once resolved, bets cannot be changed
4. **File-based database**: SQLite for simplicity (easy to back up, no server needed)
5. **All times in UTC**: Displayed in user's local timezone

## License

MIT
