import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { getRedis } from '../config/redis';
import { env } from '../config/env';

// Create rate limiter store using Redis
const createRedisStore = () => {
  const redis = getRedis();

  return {
    incr: async (key: string) => {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000));
      }
      return count;
    },
    decrement: async (key: string) => {
      await redis.decr(key);
    },
    resetKey: async (key: string) => {
      await redis.del(key);
    },
  };
};

export const createRateLimiter = (options?: {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options?.windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: options?.maxRequests || env.RATE_LIMIT_MAX_REQUESTS,
    keyGenerator: options?.keyGenerator || ((req) => req.userId || req.ip || 'anonymous'),
    skip: (req) => req.path === '/health',
    message: {
      error: 'RATE_LIMITED',
      message: 'Too many requests. Try again later.',
    },
  });
};

// General rate limiter for all endpoints
export const generalRateLimiter = createRateLimiter();

// Stricter rate limiter for auth endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
});
