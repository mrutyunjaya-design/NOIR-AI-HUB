import { OllamaProvider } from './ollama.provider';

export { OllamaProvider };

// Initialize provider with base URL from environment
const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
export const ollamaProvider = new OllamaProvider(baseUrl);
