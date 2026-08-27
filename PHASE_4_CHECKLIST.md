# NOIR AI HUB Phase 4 — Intelligent Model Routing

## ✅ Checklist

### Core Features
- ✅ **Task Detection** — Identifies: chat, coding, research, reasoning, vision, writing, summarization
- ✅ **Capability Matching** — Only selects models supporting required capabilities
- ✅ **Multi-Factor Scoring** — Rates models by: capability, quality, latency, cost, availability
- ✅ **Cost Control** — Enforces per-request & monthly budgets
- ✅ **Rate Limiting** — Per-user, per-provider, global limits
- ✅ **Fallback Strategy** — Retries compatible models with exponential backoff
- ✅ **Provider Health** — Avoids unhealthy/unavailable providers
- ✅ **Audit Trail** — Logs all routing decisions for compliance

### Safety & Compliance
- ✅ **No Subscription Bypass** — Uses only legitimate API access
- ✅ **No Secrets in Logs** — Never logs API keys or credentials
- ✅ **BYOK Support** — Routes through user's configured credentials
- ✅ **Local-First Option** — Allows Ollama/local models for privacy
- ✅ **Quota Enforcement** — Respects user subscription limits
- ✅ **Rate Limit Compliance** — Honors provider API limits

### Code Quality
- ✅ **Deterministic Scoring** — Same inputs = consistent selection
- ✅ **Configurable Weights** — Task-specific optimization
- ✅ **TypeScript Strict Mode** — Full type safety
- ✅ **Comprehensive Comments** — Clear logic explanation
- ✅ **Phase 1-3 Integrity** — All previous work remains intact

## Router Pipeline

```
User Request
     │
     ▼
Validate Request
     │
     ▼
Detect Task Type (chat, coding, research, etc.)
     │
     ▼
Determine Requirements (vision?, tools?, local?, cost-sensitive?)
     │
     ▼
Score All Available Models (capability, quality, latency, cost, availability)
     │
     ▼
Filter Compatible Models (meets minimum requirements)
     │
     ▼
Rank by Score (best → worst)
     │
     ▼
Estimate Cost (check against budget)
     │
     ▼
Select Best Model
     │
     ▼
Execute with Fallback Support
     │
     ├── Success → Response + Audit Log
     │
     └── Failure → Retry Compatible Model
```

## Multi-Factor Scoring

Each model receives scores (0-100) on:

| Factor | Weight | Meaning |
|--------|--------|----------|
| **Capability** | 35% | Does it support required features? |
| **Quality** | 25% | Accuracy & performance |
| **Latency** | 15% | Expected response speed |
| **Cost** | 15% | Price competitiveness |
| **Availability** | 10% | Is provider healthy? |

Weights adjust per task type:
- **Coding** → Emphasize capability + quality
- **Chat** → Balance speed + quality
- **Research** → Emphasize capabilities + speed
- **Reasoning** → Emphasize quality + reasoning depth

## Configuration

Adjust routing behavior in `src/config.ts`:

```typescript
ROUTER_CONFIG = {
  scoring: { ... },        // Scoring weights
  taskSpecificWeights: { ... },  // Task overrides
  fallback: { ... },       // Retry strategy
  healthCheck: { ... },    // Provider health monitoring
  costControl: { ... },    // Budget enforcement
}
```

## Usage

```typescript
import { NoirRouter } from '@noir/router';

const router = new NoirRouter();

// Step 1: Select best model
const selection = await router.selectModel({
  userId: 'user-123',
  request: {
    messages: [{ role: 'user', content: 'Write Python code...' }],
  },
  maxCostPerRequest: 0.50, // $0.50 max
  preferPrivate: false,     // OK with cloud APIs
});

console.log(`Selected: ${selection.provider.name}`);
console.log(`Model: ${selection.model.displayName}`);
console.log(`Reasoning: ${selection.reasoning}`);

// Step 2: Execute with fallback
const response = await router.executeWithFallback(
  selection,
  { messages: [...] },
  'user-123'
);
```

## Next Steps

**Phase 5 — Provider Implementations + Frontend**

Will implement:
- Full OpenAI provider integration
- Full Gemini provider integration
- Full Ollama provider integration
- Next.js frontend dashboard
- Chat interface
- Provider connection UI
- Usage tracking UI
- Router testing and optimization
