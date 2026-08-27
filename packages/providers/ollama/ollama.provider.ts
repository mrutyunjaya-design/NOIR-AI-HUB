import { AIProvider, ProviderCategory, ChatRequest, AIResponse, AIStreamChunk, AIModel, ProviderHealth } from '../core';

/**
 * Ollama Provider Adapter
 *
 * Integrates with Ollama (https://ollama.ai)
 * Runs open-source models locally without cloud API keys
 * Supports: Llama 2, Mistral, Neural Chat, and other open models
 *
 * Authentication: None (local service)
 * Requires: Ollama running locally (default: http://localhost:11434)
 */
export class OllamaProvider implements AIProvider {
  readonly id = 'ollama';
  readonly name = 'Ollama';
  readonly category = ProviderCategory.LOCAL;

  private baseUrl: string;
  private timeout = 60000; // 60 seconds (local models can be slower)

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async listModels(): Promise<AIModel[]> {
    // Phase 3 Stub: Return hardcoded models
    // Phase 4+: Fetch from Ollama /api/tags
    return [
      {
        id: 'llama2',
        name: 'llama2',
        displayName: 'Llama 2',
        description: 'Meta\'s open-source model (run locally)',
        contextWindow: 4096,
        maxTokens: 2048,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: false,
        supportsStreaming: true,
      },
      {
        id: 'mistral',
        name: 'mistral',
        displayName: 'Mistral',
        description: 'Mistral model (run locally)',
        contextWindow: 8192,
        maxTokens: 4096,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: false,
        supportsStreaming: true,
      },
      {
        id: 'neural-chat',
        name: 'neural-chat',
        displayName: 'Neural Chat',
        description: 'Neural Chat model (run locally)',
        contextWindow: 4096,
        maxTokens: 2048,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: false,
        supportsStreaming: true,
      },
    ];
  }

  async chat(request: ChatRequest): Promise<AIResponse> {
    // Phase 3 Stub: Return mock response
    // Phase 4+: Make actual request to Ollama
    const startTime = Date.now();

    // TODO: Implement Ollama API call
    // This is intentionally stubbed for Phase 3

    return {
      id: `ollama-${Date.now()}`,
      provider: 'ollama',
      model: request.model || 'llama2',
      content: '[Phase 3 Stub] Ollama response would appear here',
      usage: {
        inputTokens: 10,
        outputTokens: 10,
        totalTokens: 20,
      },
      finishReason: 'stop',
      latencyMs: Date.now() - startTime,
    };
  }

  async *stream(request: ChatRequest): AsyncIterable<AIStreamChunk> {
    // Phase 3 Stub: Yield mock tokens
    // Phase 4+: Stream from Ollama API

    const tokens = ['This', ' is', ' a', ' Phase', ' 3', ' stub', ' response', '.'];

    for (let i = 0; i < tokens.length; i++) {
      yield {
        delta: tokens[i],
        index: i,
      };

      // Simulate streaming delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    yield {
      delta: '',
      index: tokens.length,
      finishReason: 'stop',
      usage: {
        inputTokens: 10,
        outputTokens: tokens.length,
      },
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    // Phase 3 Stub: Return healthy
    // Phase 4+: Make actual health check request
    return {
      status: 'healthy',
      message: 'Ollama service is available',
      lastCheck: new Date(),
    };
  }
}
