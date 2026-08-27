/**
 * Provider index and initialization
 *
 * Exports the unified provider abstraction and all registered providers
 */

export * from './core';

// Provider implementations
export { OpenAIProvider } from './openai/openai.provider';
export { GeminiProvider } from './gemini/gemini.provider';
export { OllamaProvider } from './ollama/ollama.provider';

// Note: Provider instances are exported from individual provider packages
// Example: import { openaiProvider } from '@noir/providers/openai'
