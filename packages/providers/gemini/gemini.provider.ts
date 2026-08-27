import { AIProvider, ProviderCategory, ChatRequest, AIResponse, AIStreamChunk, AIModel, ProviderHealth } from '../core';

/**
 * Google Gemini Provider Adapter
 *
 * Integrates with Google's Gemini API (https://ai.google.dev)
 * Supports: Gemini Pro and Gemini Pro Vision
 *
 * Authentication: API key
 * Requires: GEMINI_API_KEY environment variable or user connection
 */
export class GeminiProvider implements AIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini';
  readonly category = ProviderCategory.CHAT;

  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1';
  private timeout = 30000; // 30 seconds

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
  }

  async listModels(): Promise<AIModel[]> {
    // Phase 3 Stub: Return hardcoded models
    // Phase 4+: Fetch from Gemini API
    return [
      {
        id: 'gemini-pro',
        name: 'gemini-pro',
        displayName: 'Gemini Pro',
        description: 'Google\'s advanced chat model',
        contextWindow: 32768,
        maxTokens: 8192,
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: false,
        supportsStreaming: true,
      },
      {
        id: 'gemini-pro-vision',
        name: 'gemini-pro-vision',
        displayName: 'Gemini Pro Vision',
        description: 'Gemini with vision capabilities',
        contextWindow: 32768,
        maxTokens: 8192,
        supportsText: true,
        supportsVision: true,
        supportsAudio: false,
        supportsTools: false,
        supportsStreaming: true,
      },
    ];
  }

  async chat(request: ChatRequest): Promise<AIResponse> {
    // Phase 3 Stub: Return mock response
    // Phase 4+: Make actual API request
    const startTime = Date.now();

    // TODO: Implement Gemini API call
    // This is intentionally stubbed for Phase 3

    return {
      id: `gemini-${Date.now()}`,
      provider: 'gemini',
      model: request.model || 'gemini-pro',
      content: '[Phase 3 Stub] Gemini response would appear here',
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
    // Phase 4+: Stream from Gemini API

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
      message: 'Gemini API is available',
      lastCheck: new Date(),
    };
  }
}
