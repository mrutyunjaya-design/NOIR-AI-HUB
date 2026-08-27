import { AIProvider, ProviderCategory, ChatRequest, AIResponse, AIStreamChunk, AIModel, ProviderHealth } from '../core';

/**
 * OpenAI Provider Adapter
 *
 * Integrates with OpenAI's official API (https://platform.openai.com)
 * Supports: GPT-4, GPT-3.5 Turbo, and other OpenAI models
 *
 * Authentication: API key (provided by user or NOIR admin)
 * Requires: OPENAI_API_KEY environment variable or user connection
 */
export class OpenAIProvider implements AIProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI';
  readonly category = ProviderCategory.CHAT;

  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private timeout = 30000; // 30 seconds

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.apiKey = apiKey;
  }

  async listModels(): Promise<AIModel[]> {
    // Phase 3 Stub: Return hardcoded models
    // Phase 4+: Fetch from OpenAI API
    return [
      {
        id: 'gpt-4-turbo',
        name: 'gpt-4-turbo-preview',
        displayName: 'GPT-4 Turbo',
        description: 'Most capable OpenAI model',
        contextWindow: 128000,
        maxTokens: 4096,
        supportsText: true,
        supportsVision: true,
        supportsAudio: false,
        supportsTools: true,
        supportsStreaming: true,
      },
      {
        id: 'gpt-4',
        name: 'gpt-4',
        displayName: 'GPT-4',
        description: 'Advanced OpenAI model',
        contextWindow: 8192,
        maxTokens: 4096,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: true,
        supportsStreaming: true,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'gpt-3.5-turbo',
        displayName: 'GPT-3.5 Turbo',
        description: 'Fast and cost-effective model',
        contextWindow: 4096,
        maxTokens: 2048,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: true,
        supportsStreaming: true,
      },
    ];
  }

  async chat(request: ChatRequest): Promise<AIResponse> {
    // Phase 3 Stub: Return mock response
    // Phase 4+: Make actual API request
    const startTime = Date.now();

    // TODO: Implement OpenAI API call
    // This is intentionally stubbed for Phase 3

    return {
      id: `openai-${Date.now()}`,
      provider: 'openai',
      model: request.model || 'gpt-4-turbo',
      content: '[Phase 3 Stub] OpenAI response would appear here',
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
    // Phase 4+: Stream from OpenAI API

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
      message: 'OpenAI API is available',
      lastCheck: new Date(),
    };
  }
}
