import { GeminiProvider } from './gemini.provider';

export { GeminiProvider };

// Initialize provider with API key from environment
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  export const geminiProvider = new GeminiProvider(apiKey);
} else {
  console.warn('⚠️  GEMINI_API_KEY not found. Gemini provider will not be initialized.');
}
