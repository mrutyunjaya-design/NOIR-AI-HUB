import { ChatRequest, AIResponse, AIStreamChunk, AIModel, ProviderHealth } from './types';

/**
 * Unified interface for all AI providers in NOIR
 *
 * Every provider (OpenAI, Gemini, Anthropic, Ollama, etc.) must implement this interface.
 * Provider-specific behavior should be isolated within the provider adapter, not exposed in NOIR core.
 */
export interface AIProvider {
  /**
   * Unique identifier for this provider (e.g., 'openai', 'gemini', 'ollama')
   */
  readonly id: string;

  /**
   * Human-readable name (e.g., 'OpenAI', 'Google Gemini')
   */
  readonly name: string;

  /**
   * Category of provider (chat, coding, research, local, etc.)
   */
  readonly category: ProviderCategory;

  /**
   * Fetch available models from provider
   */
  listModels(): Promise<AIModel[]>;

  /**
   * Send a chat request and get a complete response
   */
  chat(request: ChatRequest): Promise<AIResponse>;

  /**
   * Stream a chat response token-by-token
   * Yields AIStreamChunk for each token
   */
  stream(request: ChatRequest): AsyncIterable<AIStreamChunk>;

  /**
   * Check provider health and availability
   */
  healthCheck(): Promise<ProviderHealth>;
}

export enum ProviderCategory {
  CHAT = 'chat',
  CODING = 'coding',
  RESEARCH = 'research',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LOCAL = 'local',
  INFRASTRUCTURE = 'infrastructure',
}
