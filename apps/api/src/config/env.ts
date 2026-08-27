import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const env = {
  // Server
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  API_PORT: parseInt(getEnv('API_PORT', '4000')),
  API_HOST: getEnv('API_HOST', 'localhost'),

  // Database
  DATABASE_URL: getEnv('DATABASE_URL'),

  // Redis
  REDIS_URL: getEnv('REDIS_URL', 'redis://localhost:6379'),

  // JWT
  JWT_ACCESS_SECRET: getEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRY: getEnv('JWT_ACCESS_EXPIRY', '15m'),
  JWT_REFRESH_EXPIRY: getEnv('JWT_REFRESH_EXPIRY', '7d'),

  // Session
  SESSION_SECRET: getEnv('SESSION_SECRET'),

  // Frontend
  FRONTEND_URL: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),

  // Provider API Keys
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY', ''),
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY', ''),
  ANTHROPIC_API_KEY: getEnv('ANTHROPIC_API_KEY', ''),
  PERPLEXITY_API_KEY: getEnv('PERPLEXITY_API_KEY', ''),
  XAI_API_KEY: getEnv('XAI_API_KEY', ''),

  // Ollama
  OLLAMA_BASE_URL: getEnv('OLLAMA_BASE_URL', 'http://localhost:11434'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '60000')),
  RATE_LIMIT_MAX_REQUESTS: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100')),

  // Logging
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
