# NOIR API Server

Express.js backend API for NOIR AI HUB.

## Setup

```bash
cd apps/api
pnpm install
```

## Configuration

Create `.env.local`:

```bash
cp ../../.env.example .env.local
```

## Running

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` — Create new account
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/logout` — Logout
- `POST /api/v1/auth/refresh` — Refresh access token

### Users
- `GET /api/v1/users/me` — Get current user

### Health
- `GET /api/v1/health` — Health check

## Architecture

- **Middleware**: Authentication, validation, rate limiting, error handling
- **Modules**: Organized by feature (auth, users, conversations, etc.)
- **Services**: Business logic layer
- **Controllers**: Request handlers
- **Config**: Database, Redis, environment configuration

## Security

- HTTPS/TLS (production)
- CORS restrictions
- Rate limiting
- Input validation with Zod
- Secure password hashing (Argon2)
- JWT with refresh tokens
- HTTP-only cookies for sensitive tokens
