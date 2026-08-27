import { createClient } from 'redis';
import { env } from './env';

let redisClient: ReturnType<typeof createClient> | null = null;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis initialization failed:', error);
    process.exit(1);
  }
};

export const getRedis = () => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
  }
};
