# Ollama Provider

Local integration with Ollama (https://ollama.ai)

Run open-source LLMs locally without cloud dependencies or API keys.

## Setup

1. Install Ollama: https://ollama.ai/download
2. Pull a model:

```bash
ollama pull llama2
ollama pull mistral
```

3. Start Ollama:

```bash
ollama serve
```

4. Configure NOIR:

```bash
OLLAMA_BASE_URL=http://localhost:11434
```

## Supported Models

- Llama 2
- Mistral
- Neural Chat
- And 100+ other open models

## Features

- ✅ Chat completion
- ✅ Streaming responses
- ✅ No API key required
- ✅ Private (runs locally)
- ✅ Free

## Status

- Phase 3: Stub implementation
- Phase 4+: Full API integration
