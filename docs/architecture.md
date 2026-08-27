# NOIR AI HUB Architecture

## System Overview

```
                         NOIR WEB APP
                        (Next.js/React)
                               │
                          HTTPS/SSE
                               │
                         NOIR API GATEWAY
                       (Node.js + Express)
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
      Authentication       AI Router         Conversations
            │                  │                  │
            │         Provider Registry          │
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
        PostgreSQL          Redis          External APIs
            │             (Cache/Queue)           │
            │                                     ├─ Gemini
            │                                     ├─ OpenAI
            │                                     ├─ Claude
            │                                     ├─ Perplexity
            │                                     ├─ xAI
            │                                     ├─ HuggingFace
            │                                     └─ Ollama
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Hooks
- **API Client**: Fetch API / SWR
- **Testing**: Vitest + Playwright

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Queue**: BullMQ
- **Auth**: JWT + Refresh Tokens
- **Validation**: Zod
- **Testing**: Vitest + Supertest

### Infrastructure
- **Monorepo**: Turborepo + pnpm
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **Edge Cache**: Cloudflare
- **Observability**: OpenTelemetry
- **Deployment**: Docker Compose (dev), Kubernetes (prod ready)

## Database Schema

### User Management
```
User
├── id (PK)
├── email (UNIQUE)
├── passwordHash
├── name
├── avatarUrl
├── emailVerified
├── role (ENUM: USER, MODERATOR, ADMIN, OWNER)
├── createdAt
├── updatedAt
│
├── Conversations (1:N)
├── OAuthAccounts (1:N)
├── RefreshTokens (1:N)
├── UsageRecords (1:N)
└── ProviderConnections (1:N)
```

### Conversations & Messages
```
Conversation
├── id (PK)
├── userId (FK)
├── title
├── archived
├── createdAt
├── updatedAt
│
└── Messages (1:N)
    ├── id (PK)
    ├── conversationId (FK)
    ├── role (ENUM: SYSTEM, USER, ASSISTANT, TOOL)
    ├── content
    ├── provider
    ├── model
    ├── inputTokens
    ├── outputTokens
    ├── latencyMs
    └── createdAt
```

### Providers & Models
```
Provider
├── id (PK)
├── slug (UNIQUE)
├── name
├── enabled
├── createdAt
├── updatedAt
│
└── Models (1:N)
    ├── id (PK)
    ├── providerId (FK)
    ├── slug
    ├── displayName
    ├── supportsText
    ├── supportsVision
    ├── supportsAudio
    ├── supportsTools
    ├── supportsImages
    ├── createdAt
    └── updatedAt
```

### Usage & Billing
```
UsageRecord
├── id (PK)
├── userId (FK)
├── provider
├── model
├── requestId
├── inputTokens
├── outputTokens
├── totalTokens
├── estimatedCost
├── latency
├── status
└── createdAt

Subscription
├── id (PK)
├── userId (FK)
├── plan
├── status
├── quotaLimit
├── quotaUsed
├── renewalDate
└── createdAt
```

## NOIR AI Router

### Overview

The AI Router is the core intelligence system that:

1. **Analyzes** the request (task type, requirements)
2. **Scores** available models
3. **Selects** the optimal model
4. **Executes** the request
5. **Normalizes** the response
6. **Handles** failures intelligently

### Scoring Algorithm

```
Score = (capability × 0.3)
      + (quality × 0.25)
      + (availability × 0.2)
      + (speed × 0.15)
      + (user_preference × 0.1)
      - (estimated_cost × 0.05)
```

### Capability Detection

```typescript
enum TaskType {
  CHAT,
  CODING,
  RESEARCH,
  REASONING,
  VISION,
  WRITING,
  SUMMARIZATION,
}

interface RoutingContext {
  taskType: TaskType;
  requiresWebSearch: boolean;
  requiresVision: boolean;
  requiresTools: boolean;
  maxLatency?: number;
  maxCost?: number;
  preferredProvider?: string;
  preferredModel?: string;
  userQuotaAvailable: number;
}
```

### Provider Abstraction

```typescript
export interface AIProvider {
  id: string;
  name: string;
  
  listModels(): Promise<Model[]>;
  
  chat(
    request: ChatRequest
  ): Promise<AIResponse>;
  
  stream(
    request: ChatRequest
  ): AsyncIterable<AIStreamChunk>;
  
  healthCheck(): Promise<HealthStatus>;
}
```

## API Architecture

### Authentication Flow

```
Login Request
    ↓
Validate credentials
    ↓
Generate JWT (15 min)
    ↓
Generate Refresh Token
    ↓
Store RT in secure cookie
    ↓
Return AT in response
    ↓
Client stores AT in memory
    ↓
Use AT for API calls
```

### Request Flow

```
Client Request
    ↓
Rate Limit Check
    ↓
Auth Middleware
    ↓
RBAC Check
    ↓
Input Validation (Zod)
    ↓
Business Logic
    ↓
Database Query
    ↓
Response
```

### Chat Streaming

```
Client Request
    ↓
NOIR Router
    ↓
AI Provider
    ↓
Token Stream (Server-Sent Events)
    ↓
Client WebSocket/SSE
    ↓
UI Update (Real-time)
```

## Module Structure

### Backend Modules

```
api/src/modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.middleware.ts
│   └── dto/
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│
├── conversations/
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   └── dto/
│
├── messages/
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── dto/
│
├── models/
│   ├── models.controller.ts
│   ├── models.service.ts
│   └── dto/
│
├── providers/
│   ├── providers.controller.ts
│   ├── providers.service.ts
│   └── dto/
│
├── router/
│   ├── router.service.ts
│   ├── router.types.ts
│   ├── scoring.ts
│   └── fallback.ts
│
├── usage/
│   ├── usage.service.ts
│   └── usage.repository.ts
│
├── files/
│   ├── files.controller.ts
│   ├── files.service.ts
│   └── storage.service.ts
│
├── admin/
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── dto/
│
└── health/
    ├── health.controller.ts
    └── health.service.ts
```

## Caching Strategy

### Redis Keys

```
user:{userId}:session       → Session data
user:{userId}:quota         → Usage quota
provider:{provider}:health  → Provider health status
model:{model}:info          → Model metadata
conversation:{convId}       → Recent messages
rate-limit:{userId}         → Rate limit counter
```

### Cache Invalidation

```
User updates profile → Invalidate user:{userId}:session
Model registry changes → Invalidate model:*
Provider goes down → Invalidate provider:{provider}:health
Message sent → Cache conversation:{convId}
```

## Security Architecture

```
                    INTERNET
                        │
                        ▼
                   Cloudflare
                   (WAF/DDoS)
                        │
                        ▼
                      Nginx
                  (Reverse Proxy)
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          Next.js              Express API
              │                     │
              │              Rate Limiter
              │                     │
              │              Auth Middleware
              │                     │
              │              RBAC Guard
              │                     │
              │              Input Validation
              │                     │
              │              Business Logic
              │                     │
              │              ┌──────┴──────┐
              │              ▼             ▼
              │          PostgreSQL      Redis
              │         (Encrypted)   (Restricted)
              │
              └────────────────────────┘
```

## Deployment Architecture

### Development

```yaml
docker-compose.yml
├── postgres (5432)
├── redis (6379)
├── api (4000)
├── web (3000)
└── adminer (8080)
```

### Production

```
LoadBalancer (Cloudflare)
    │
    ▼
Nginx Ingress
    ├── next-replica-1
    ├── next-replica-2
    └── next-replica-3
    ├── api-replica-1
    ├── api-replica-2
    └── api-replica-3
    │
    ├── PostgreSQL Primary
    │   └── Replicas
    │
    └── Redis Cluster
```

## Error Handling

### Provider Failure

```
Request to Provider A
    │
    ├─ Error?
    │   ├─ Timeout? → Retry with backoff
    │   ├─ Rate limit? → Queue for later
    │   ├─ Auth error? → Notify user
    │   └─ Server error? → Try fallback provider
    │
    └─ Success? → Return response
```

## Monitoring & Observability

### Metrics

- Request latency (p50, p95, p99)
- Provider availability
- Token usage per provider
- Cost estimation accuracy
- Router decision distribution
- Cache hit ratio
- Error rates by type

### Logs

- Structured JSON logging
- User action audit trail
- API request/response
- Provider interactions
- Error stack traces
- Performance metrics

### Tracing

- OpenTelemetry integration
- Distributed trace correlation
- Latency breakdown per service
- Provider response time tracking
