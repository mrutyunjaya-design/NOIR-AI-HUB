# NOIR AI Provider Abstraction Layer

Unified interface and registry for all AI providers integrated with NOIR.

## Overview

This package provides:

- **AIProvider Interface** — Common contract for all providers
- **Request/Response Types** — Standardized formats
- **Provider Registry** — Dynamic provider management
- **Health Checks** — Provider status monitoring
- **Streaming Support** — Real-time token streaming

## Architecture

```
AIProvider (Interface)
    │
    ├── OpenAI Provider
    ├── Gemini Provider
    ├── Anthropic Provider
    ├── Ollama Provider
    ├── Perplexity Provider
    ├── xAI Provider
    └── ... (future providers)
```

## Adding a New Provider

1. Create directory: `packages/providers/[provider-name]/`
2. Implement `AIProvider` interface
3. Handle authentication (API key, OAuth, etc.)
4. Normalize responses to `AIResponse` format
5. Register provider with registry
6. Add tests

## Usage

```typescript
import { getProvider } from '@noir/providers';

const provider = getProvider('openai');
const response = await provider.chat({
  messages: [{ role: 'user', content: 'Hello' }],
  model: 'gpt-4-turbo',
});
```

## Provider Status

- **OpenAI** — Implemented (Phase 3)
- **Gemini** — Stub (Phase 3)
- **Ollama** — Stub (Phase 3)
- **Others** — Planned (Phase 4+)

## Security

- No API keys in source code
- Environment variables only
- Credentials encrypted in database
- Request isolation per user
- Rate limit tracking

## Testing

```bash
pnpm test
```

## Documentation

See individual provider directories for specific setup instructions.
