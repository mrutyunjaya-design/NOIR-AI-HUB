import { OpenAIProvider } from './openai.provider';

export { OpenAIProvider };

// Initialize provider with API key from environment
const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
  export const openaiProvider = new OpenAIProvider(apiKey);
} else {
  console.warn('⚠️  OPENAI_API_KEY not found. OpenAI provider will not be initialized.');
}
