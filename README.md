# NOIR AI HUB

**One Interface. Every AI.**

An open-source unified AI workspace for accessing multiple AI providers, local LLMs, coding agents, research tools, and developer services from one interface.

## 🌌 Overview

NOIR AI HUB brings multiple AI services and open-source models into a single, integrated platform. Instead of juggling between ChatGPT, Gemini, Claude, and local models, NOIR provides:

- **Unified Dashboard** — One interface for all AI models
- **Smart Router** — Automatically selects the best model for your task
- **Multiple Providers** — Gemini, OpenAI, Claude, Perplexity, xAI, Hugging Face, Ollama
- **Bring Your Own Key** — Use your own API credentials securely
- **Local Models** — Run private models through Ollama
- **No Paywalls** — Uses official APIs, free tiers, and open models

## ✨ Key Features

### NOIR Chat
Conversational AI with automatic provider selection.

### NOIR Code
Optimized for programming tasks with coding-capable models.

### NOIR Research
Web-grounded research with search integration.

### NOIR Private
Local-first with Ollama and privacy-focused models.

### NOIR Compare
Run the same prompt across multiple models side-by-side.

### NOIR Auto
Intelligent model selection based on task type.

## 🏗️ Architecture

```
                    NOIR WEB APP
                   (Next.js/React)
                          │
                    HTTPS / SSE
                          │
                    NOIR API GATEWAY
                  (Node.js + Express)
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
    Authentication    AI Router         Conversations
        │                 │                  │
        │        Provider Registry          │
        │                 │                  │
        └─────────────────┼──────────────────┘
                          │
        ┌─────────────────┼──────────────────────┐
        ▼                 ▼                      ▼
    PostgreSQL        Redis              External Providers
        │           (Cache/Queue)              │
        │                                      ├─ Gemini
        │                                      ├─ OpenAI
        │                                      ├─ Claude
        │                                      ├─ Perplexity
        │                                      ├─ xAI
        │                                      ├─ Hugging Face
        │                                      └─ Ollama
```

## 🚀 Technology Stack

| Layer | Technology |
|-------|----------|
| **Frontend** | Next.js + React + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Backend** | Node.js + Express + TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Cache/Queue** | Redis + BullMQ |
| **Auth** | JWT + Refresh Tokens |
| **API Docs** | OpenAPI |
| **Testing** | Vitest + Playwright |
| **Monorepo** | Turborepo + pnpm |
| **Deployment** | Docker + Nginx |
| **Observability** | OpenTelemetry |

## 📁 Project Structure

```
noir-ai-hub/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Express API
├── packages/
│   ├── ai-core/             # Core AI interfaces
│   ├── providers/            # Provider implementations
│   ├── database/             # Prisma schema & client
│   ├── auth/                 # Authentication logic
│   ├── security/             # Security utilities
│   ├── logger/               # Logging
│   └── shared/               # Shared utilities
├── infrastructure/          # Docker, Nginx, etc.
├── docs/                     # Documentation
├── .github/                  # GitHub workflows
└── docker-compose.yml       # Local development
```

## 🔐 Security & Licensing

**NOIR AI HUB is an independent open-source software project.**

NOIR does not:
- Provide unauthorized access to paid subscriptions
- Bypass provider authentication or rate limits
- Claim ownership of third-party models or services

NOIR uses:
- Officially supported APIs
- Provider free tiers (as available)
- User-provided API keys (BYOK)
- Open-source and local models

For detailed terms, see [LEGAL.md](docs/legal.md) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Local Development

```bash
# Clone repository
git clone https://github.com/mrutyunjaya-design/noir-ai-hub.git
cd noir-ai-hub

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Start services
docker-compose up -d

# Run migrations
pnpm run migrate

# Start dev server
pnpm run dev
```

Services will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Adminer: http://localhost:8080

## 🧠 NOIR Router

The intelligence behind NOIR is the **AI Router** — an intelligent system that:

1. **Analyzes** the task type and requirements
2. **Scores** available models based on:
   - Capability match
   - Quality rating
   - Availability & health
   - Latency
   - User preference
   - Estimated cost
3. **Selects** the optimal model
4. **Executes** the request
5. **Normalizes** the response
6. **Handles** provider failures with intelligent fallbacks

### Example

```
User: "Explain this React error"
       ↓
NOIR Router analyzes task
       ↓
Detects: coding task, needs reasoning
       ↓
Scores available models
       ↓
Selects: Optimal coding model
       ↓
Returns: Unified response
```

## 🤝 Provider Integration

NOIR uses a unified provider interface:

```typescript
export interface AIProvider {
  id: string;
  listModels(): Promise<Model[]>;
  chat(request: ChatRequest): Promise<AIResponse>;
  stream(request: ChatRequest): AsyncIterable<AIStreamChunk>;
  healthCheck(): Promise<boolean>;
}
```

Adding a new provider doesn't require changing NOIR core — only implement the interface.

## 📊 Database Schema

Key entities:

- **users** — User accounts with roles
- **conversations** — Chat sessions
- **messages** — Individual messages with token usage
- **providers** — Available AI providers
- **models** — Available AI models
- **model_capabilities** — Model features (vision, tools, etc.)
- **usage_records** — Token usage & cost tracking
- **provider_connections** — User's encrypted provider credentials

See [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma) for full schema.

## 🔄 Development Phases

### Phase 1 — Foundation ✓
- [ ] Monorepo setup
- [ ] Next.js + Express
- [ ] PostgreSQL + Prisma
- [ ] Redis
- [ ] Authentication

### Phase 2 — AI Integration
- [ ] Provider abstraction
- [ ] Gemini integration
- [ ] OpenAI integration
- [ ] Ollama support
- [ ] Unified chat interface
- [ ] Streaming responses

### Phase 3 — Router
- [ ] Auto model selection
- [ ] Capability detection
- [ ] Provider health monitoring
- [ ] Cost-aware routing
- [ ] Intelligent fallbacks

### Phase 4 — Advanced Features
- [ ] Compare mode
- [ ] File uploads & RAG
- [ ] Projects
- [ ] Developer mode
- [ ] Web search integration

### Phase 5 — Platform
- [ ] Admin dashboard
- [ ] Usage analytics
- [ ] Bring Your Own Key (BYOK)
- [ ] Team accounts
- [ ] Billing & quotas

## 📚 Documentation

- [Architecture Guide](docs/architecture.md) — Detailed system design
- [API Reference](docs/api.md) — Endpoint documentation
- [Provider Guide](docs/providers.md) — Setting up providers
- [Security Policy](SECURITY.md) — Security practices
- [Contributing](docs/contributing.md) — How to contribute
- [Legal & Licensing](docs/legal.md) — Terms and licensing

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/contributing.md) for guidelines.

Areas we're looking for help:
- [ ] Provider implementations
- [ ] Frontend features
- [ ] Documentation
- [ ] Tests
- [ ] Deployment configs
- [ ] Bug fixes

## 📝 License

NOIR AI HUB is licensed under [Apache License 2.0](LICENSE).

Third-party integrations and models are subject to their respective licenses. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for details.

## 🛡️ Security

Please see [SECURITY.md](SECURITY.md) for our security policy and responsible disclosure practices.

## 💬 Community

- **Issues** — Bug reports and feature requests
- **Discussions** — Questions and ideas
- **Pull Requests** — Contributions

## 🙏 Acknowledgments

NOIR AI HUB integrates with many excellent projects and services:
- [Ollama](https://ollama.ai) — Local LLM runtime
- [Prisma](https://www.prisma.io) — ORM
- [Next.js](https://nextjs.org) — Frontend framework
- [shadcn/ui](https://ui.shadcn.com) — UI components

And thanks to all AI providers for their APIs and services.

---

**NOIR — One Interface. Every AI.**