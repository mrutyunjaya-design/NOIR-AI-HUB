/**
 * Rate limit and quota enforcement
 */

import { prisma } from '@noir/database';

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  tokensPerDay: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  FREE: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
    tokensPerDay: 100000, // 100k tokens
  },
  PRO: {
    requestsPerMinute: 100,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    tokensPerDay: 10000000, // 10M tokens
  },
  ENTERPRISE: {
    requestsPerMinute: 1000,
    requestsPerHour: 100000,
    requestsPerDay: 1000000,
    tokensPerDay: 1000000000, // 1B tokens
  },
};

export class RateLimitError extends Error {
  constructor(
    public retryAfterSeconds: number,
    message: string = 'Rate limit exceeded'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Check if user has exceeded rate limits
 */
export async function checkRateLimit(
  userId: string,
  tier: string = 'FREE'
): Promise<void> {
  const config = RATE_LIMITS[tier] || RATE_LIMITS.FREE;

  // Check usage in last minute
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentRequests = await prisma.usageRecord.count({
    where: {
      userId,
      createdAt: { gte: oneMinuteAgo },
    },
  });

  if (recentRequests >= config.requestsPerMinute) {
    throw new RateLimitError(60, `Rate limit: ${config.requestsPerMinute} requests per minute`);
  }

  // Check usage in last hour
  const oneHourAgo = new Date(Date.now() - 3600000);
  const hourRequests = await prisma.usageRecord.count({
    where: {
      userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (hourRequests >= config.requestsPerHour) {
    throw new RateLimitError(3600, `Rate limit: ${config.requestsPerHour} requests per hour`);
  }

  // Check daily token usage
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const dailyTokens = await prisma.usageRecord.aggregate({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
    _sum: {
      totalTokens: true,
    },
  });

  const tokensUsed = dailyTokens._sum.totalTokens || 0;
  if (tokensUsed >= config.tokensPerDay) {
    throw new RateLimitError(
      86400,
      `Daily token limit exceeded: ${config.tokensPerDay} tokens per day`
    );
  }
}

/**
 * Check if user has exceeded budget
 */
export async function checkBudget(
  userId: string,
  estimatedCost: number,
  maxCostPerRequest?: number
): Promise<void> {
  if (maxCostPerRequest && estimatedCost > maxCostPerRequest) {
    throw new Error(
      `Estimated cost ($${estimatedCost.toFixed(4)}) exceeds per-request limit ($${maxCostPerRequest.toFixed(4)})`
    );
  }

  // Check monthly budget
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    throw new Error('No subscription found');
  }

  if (subscription.quotaUsed >= subscription.monthlyQuota) {
    throw new Error('Monthly quota exceeded');
  }
}
