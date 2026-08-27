/**
 * Core types for NOIR AI Provider abstraction layer
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: Record<string, any>;
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>; // JSON Schema
  };
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number; // 0-2
  maxTokens?: number;
  topP?: number; // 0-1
  topK?: number;
  stream?: boolean;
  tools?: ToolDefinition[];
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}

export interface AIResponse {
  id: string;
  provider: string;
  model: string;
  content: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'error' | 'unknown';
  latencyMs?: number;
  error?: string;
}

export interface AIStreamChunk {
  delta: string; // Partial token content
  index: number; // Token index
  finishReason?: string; // When stream ends
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  contextWindow?: number;
  maxTokens?: number;
  supportsText: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsTools: boolean;
  supportsStreaming: boolean;
}

export interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  lastCheck: Date;
}

export interface ProviderCapabilities {
  supportedTasks: string[]; // 'chat', 'vision', 'code', 'reasoning', etc.
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsFileUploads: boolean;
  rateLimit?: number; // requests per minute
}

export class ProviderError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export class AuthenticationError extends ProviderError {
  constructor(message: string = 'Authentication failed') {
    super('AUTH_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends ProviderError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number
  ) {
    super('RATE_LIMIT_ERROR', message, 429);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends ProviderError {
  constructor(message: string = 'Quota exceeded') {
    super('QUOTA_EXCEEDED_ERROR', message, 429);
    this.name = 'QuotaExceededError';
  }
}

export class TimeoutError extends ProviderError {
  constructor(message: string = 'Request timeout') {
    super('TIMEOUT_ERROR', message, 504);
    this.name = 'TimeoutError';
  }
}
