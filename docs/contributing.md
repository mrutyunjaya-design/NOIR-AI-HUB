# Contributing to NOIR AI HUB

Thank you for your interest in contributing to NOIR! This guide will help you get started.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Git
- Docker (for local development)

### Setup Development Environment

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

# Start development
pnpm run dev
```

### Project Structure

Familiarize yourself with the monorepo structure:

```
apps/
├── web/           # Next.js frontend
└── api/           # Express backend

packages/
├── ai-core/       # Core AI interfaces
├── providers/     # Provider implementations
├── database/      # Database schema & client
├── auth/          # Authentication
├── security/      # Security utilities
├── logger/        # Logging
└── shared/        # Shared utilities
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation
- `chore/description` — Maintenance
- `refactor/description` — Code refactoring

### 2. Make Changes

When making changes:

- Write clear, descriptive commit messages
- Follow the existing code style
- Add tests for new functionality
- Update documentation
- Keep commits atomic and logical

### 3. Test Locally

```bash
# Run linting
pnpm run lint

# Run type checking
pnpm run type-check

# Run tests
pnpm run test

# Build project
pnpm run build
```

### 4. Commit & Push

```bash
git add .
git commit -m "feat: add feature description"
git push origin feature/your-feature
```

### 5. Open Pull Request

Go to GitHub and create a pull request:

- Use a clear, descriptive title
- Reference any related issues (#123)
- Provide context and motivation
- Include screenshots/examples if applicable

## Code Style

### TypeScript

```typescript
// Use interfaces for object types
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// Use async/await
async function fetchUser(id: string): Promise<User> {
  const user = await db.user.findUnique({ where: { id } });
  return user;
}

// Use const for immutability
const MAX_RETRIES = 3;

// Use descriptive variable names
const isEmailVerified = user.emailVerified;
```

### React/Next.js

```typescript
// Use functional components
export function UserCard({ user }: { user: User }) {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Use hooks properly
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false));
  }, [id]);

  return { user, loading };
}
```

### Naming Conventions

- Use PascalCase for components, classes, types
- Use camelCase for functions, variables, properties
- Use UPPER_CASE for constants
- Use descriptive names (avoid `data`, `temp`, `x`)
- Prefix boolean variables with `is`, `has`, `should`, `can`

## Adding a Provider

To add a new AI provider to NOIR:

### 1. Create Provider Package

```bash
mkdir -p packages/providers/[provider-name]
```

### 2. Implement Provider Interface

```typescript
// packages/providers/[provider-name]/src/provider.ts

import { AIProvider, ChatRequest, AIResponse } from '@noir/ai-core';

export class ProviderNameProvider implements AIProvider {
  id = 'provider-name';
  name = 'Provider Name';

  async listModels() {
    // Fetch available models
  }

  async chat(request: ChatRequest): Promise<AIResponse> {
    // Handle chat request
  }

  async *stream(request: ChatRequest) {
    // Handle streaming response
  }

  async healthCheck() {
    // Check provider status
  }
}
```

### 3. Handle Authentication

```typescript
// Support multiple auth methods
export class ProviderNameProvider implements AIProvider {
  constructor(
    private apiKey: string,
    private options?: ProviderOptions
  ) {}

  // Validate credentials
  async authenticate(): Promise<boolean> {
    try {
      await this.makeRequest('/health');
      return true;
    } catch {
      return false;
    }
  }
}
```

### 4. Normalize Responses

```typescript
// Convert provider response to unified format
private normalizeResponse(providerResponse: any): AIResponse {
  return {
    id: providerResponse.id,
    provider: this.id,
    model: providerResponse.model,
    content: providerResponse.text || providerResponse.content,
    usage: {
      inputTokens: providerResponse.usage?.prompt_tokens,
      outputTokens: providerResponse.usage?.completion_tokens,
      totalTokens: providerResponse.usage?.total_tokens,
    },
    finishReason: providerResponse.finish_reason,
    latencyMs: Date.now() - startTime,
  };
}
```

### 5. Add Tests

```typescript
// packages/providers/[provider-name]/test/provider.test.ts

import { describe, it, expect } from 'vitest';
import { ProviderNameProvider } from '../src/provider';

describe('ProviderNameProvider', () => {
  it('should list models', async () => {
    const provider = new ProviderNameProvider('test-key');
    const models = await provider.listModels();
    expect(models).toBeInstanceOf(Array);
  });

  it('should handle chat requests', async () => {
    const provider = new ProviderNameProvider('test-key');
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'model-name',
    });
    expect(response.content).toBeDefined();
  });
});
```

### 6. Document Setup

Create documentation for the provider:

```markdown
# Provider Name Integration

## Setup

1. Get API key from [Provider URL]
2. Add to NOIR:
   - UI: Settings → Providers → Connect
   - Or environment: `PROVIDER_NAME_API_KEY=...`

## Features

- Model A
- Model B
- Streaming support
- Vision capability

## Pricing

[Pricing details]

## Status

✅ Chat
✅ Streaming
⏳ Vision
```

### 7. Update Provider Registry

Add to `docs/providers.md`:

```markdown
- **Provider Name** — Description | https://provider.com
```

## Testing

### Unit Tests

```bash
pnpm test
```

### Integration Tests

```bash
pnpm test:integration
```

### E2E Tests

```bash
pnpm test:e2e
```

### Test Guidelines

- Write tests alongside code
- Aim for >80% coverage
- Test happy paths and errors
- Mock external dependencies
- Use descriptive test names

## Documentation

### Update Documentation When:

- Adding new features
- Changing APIs
- Adding providers
- Fixing bugs (if non-obvious)
- Changing deployment process

### Documentation Locations:

- `docs/architecture.md` — System design
- `docs/api.md` — API reference
- `docs/providers.md` — Provider list
- `docs/contributing.md` — This file
- `README.md` — Project overview
- Inline comments — Complex logic

## Pull Request Process

### Before Submitting

- [ ] Code follows style guide
- [ ] All tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Documentation is updated
- [ ] Commits are clear and logical
- [ ] No unrelated changes

### PR Description Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #(issue number)

## Testing

Describe testing performed.

## Screenshots

If applicable, add screenshots.
```

## Reporting Issues

### Bug Reports

Include:

1. **Description** — Clear summary
2. **Reproduction** — Steps to reproduce
3. **Expected behavior** — What should happen
4. **Actual behavior** — What actually happens
5. **Environment** — OS, Node version, etc.
6. **Logs/error** — Error messages or logs

### Feature Requests

Include:

1. **Description** — Clear use case
2. **Motivation** — Why it's needed
3. **Proposed solution** — How it could work
4. **Alternatives** — Other approaches

## License

By contributing to NOIR, you agree that your contributions will be licensed under the Apache License 2.0.

## Questions?

- Open an issue for questions
- Join discussions for ideas
- Check existing issues first

## Recognition

Contributors will be recognized in:

- `CONTRIBUTORS.md`
- GitHub release notes
- Project documentation

Thank you for contributing to NOIR! 🚀
