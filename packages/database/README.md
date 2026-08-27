# Database Schema & Prisma Configuration

This package contains the NOIR AI HUB PostgreSQL database schema and Prisma ORM configuration.

## Setup

```bash
cd packages/database
pnpm install
```

## Environment

Set `DATABASE_URL` in `.env.local`:

```bash
DATABASE_URL="postgresql://noir:noir@localhost:5432/noir_dev"
```

## Commands

```bash
# Create a new migration
pnpm prisma migrate dev --name feature_name

# Apply pending migrations
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset

# Generate Prisma Client
pnpm prisma generate

# Open Prisma Studio (visual DB browser)
pnpm prisma studio

# Seed database
pnpm prisma db seed
```

## Schema Overview

See `schema.prisma` for the complete schema.

Main entities:

- **User** — Account with roles, OAuth
- **Conversation** — Chat session
- **Message** — Individual messages with token usage
- **Provider** — Available AI providers
- **Model** — Available AI models
- **ProviderConnection** — User's encrypted provider credentials
- **UsageRecord** — Token usage & cost tracking
- **Subscription** — User plan & quotas
- **AuditLog** — Compliance & security logging

## Migrations

Migrations are automatically tracked in `./migrations/`.

Never edit migration files after applying them. Instead:

1. Create a new migration
2. Modify the schema
3. Apply the new migration

## Seeding

Seed initial data:

```bash
pnpm prisma db seed
```

Edit `seed.ts` to customize initial data.

## Prisma Client

Import in your code:

```typescript
import { prisma } from '@noir/database';

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

## Safety

- Never commit `.env` files
- Always review migrations before applying
- Test schema changes locally first
- Keep migrations small and focused
- Use transactions for related changes
