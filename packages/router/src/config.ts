/**
 * Router configuration and weights
 */

export const ROUTER_CONFIG = {
  // Scoring weights
  scoring: {
    weights: {
      capability: 0.35,
      quality: 0.25,
      latency: 0.15,
      cost: 0.15,
      availability: 0.1,
    },
    minCapabilityScore: 50, // Minimum capability match
  },

  // Task-specific weights (override defaults)
  taskSpecificWeights: {
    chat: { capability: 0.3, quality: 0.3, latency: 0.2, cost: 0.1, availability: 0.1 },
    coding: { capability: 0.4, quality: 0.35, latency: 0.1, cost: 0.1, availability: 0.05 },
    reasoning: { capability: 0.4, quality: 0.4, latency: 0.1, cost: 0.05, availability: 0.05 },
    research: { capability: 0.3, quality: 0.3, latency: 0.2, cost: 0.1, availability: 0.1 },
  },

  // Fallback strategy
  fallback: {
    maxRetries: 3,
    backoffMultiplier: 2, // Exponential backoff
    initialDelayMs: 1000,
  },

  // Health check
  healthCheck: {
    intervalMs: 60000, // Check every minute
    timeoutMs: 5000, // 5 second timeout
  },

  // Cost limiting
  costControl: {
    estimationTolerance: 0.15, // 15% estimation error margin
    maxCostPerRequest: 1.0, // Don't allow requests >$1 by default
  },
};
