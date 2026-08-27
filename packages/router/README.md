# NOIR AI Router

Intelligent model selection and routing engine that decides which AI provider and model to use based on user requirements, capabilities, cost, and performance.

## Overview

The NOIR Router is the core intelligence that transforms NOIR from a simple API proxy into a truly smart multi-model AI platform.

## Pipeline

```
User Request
     │
     ▼
Validate Request
     │
     ▼
Detect Task Type
     │
     ▼
Determine Requirements
     │
     ▼
Filter Compatible Models
     │
     ▼
Check Availability & Health
     │
     ▼
Check Rate Limits + Quota
     │
     ▼
Calculate Model Scores
     │
     ▼
Select Best Model
     │
     ▼
Execute Provider Adapter
     │
     ├── Success ──────► Response + Audit Log
     │
     └── Failure
            │
            ▼
       Try Compatible Fallback
            │
            ▼
       Response + Audit Log
```

## Features

### Task Detection

Automatically identifies the type of request:
- **chat** — Conversational AI
- **coding** — Code generation, debugging, explanation
- **research** — Web search, fact checking, analysis
- **reasoning** — Complex problem solving, step-by-step thinking
- **vision** — Image understanding, OCR, visual analysis
- **writing** — Creative writing, editing, style transformation
- **summarization** — Document/text summarization

### Capability Matching

Ensures selected models support:
- Text understanding
- Vision/image analysis
- Tool use (function calling)
- Streaming responses
- Custom instructions
- Token limit requirements

### Multi-Factor Scoring

Selects models based on:
1. **Capability Match** (0-100) — Does it support required features?
2. **Quality Score** (0-100) — Model accuracy/performance
3. **Latency Score** (0-100) — Expected response time
4. **Cost Score** (0-100) — Price competitiveness
5. **Availability** (0-1) — Provider health status
6. **User Preference** (0-100) — User's preferred provider

### Cost Control

- Enforces per-user monthly budgets
- Respects per-request cost limits
- Prevents quota overages
- Tracks estimated vs. actual costs
- Suggests cheaper alternatives

### Rate Limiting

- Per-user limits (requests/minute)
- Per-provider limits (API constraints)
- Global limits (system capacity)
- Graceful backoff and retry

### Provider Health

- Monitors provider availability
- Tracks recent failures
- Avoids unhealthy providers
- Automatic health checks

### BYOK (Bring Your Own Key)

- Routes requests through user's own API keys
- No NOIR infrastructure costs for BYOK
- Respects user's provider connections

### Local-First Mode

- Allows users to opt for privacy
- Routes to Ollama for local execution
- No external API calls for private requests

## Usage

```typescript
import { NoirRouter } from '@noir/router';
import { prisma } from '@noir/database';

const router = new NoirRouter();

const selection = await router.selectModel({
  userId: 'user-123',
  request: {
    messages: [{ role: 'user', content: 'Write Python code...' }],
  },
  preferPrivate: false,
});

console.log(`Selected: ${selection.provider.name} / ${selection.model.displayName}`);
const response = await selection.provider.chat(request);
```

## Safety & Compliance

- ✅ No subscription bypass
- ✅ Legitimate API access only
- ✅ No secrets in logs
- ✅ Audit trail for all requests
- ✅ User quota enforcement
- ✅ Rate limit compliance
- ✅ Cost transparency

## Configuration

See `src/config/` for router tuning:
- Scoring weights
- Rate limit tiers
- Health check intervals
- Fallback strategies
- Cost limits
