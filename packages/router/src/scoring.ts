/**
 * Model scoring and selection logic
 */

import { AIModel } from '@noir/providers';
import { TaskRequirements } from './task';

export interface ModelScore {
  model: AIModel;
  providerId: string;
  providerName: string;
  totalScore: number;
  scores: {
    capability: number; // 0-100: Does it support needed features?
    quality: number; // 0-100: Model accuracy
    latency: number; // 0-100: Expected speed (100 = fastest)
    cost: number; // 0-100: Price competitiveness (100 = cheapest)
    availability: number; // 0-100: Provider health
  };
  reasoning: string; // Why this model was selected
}

export interface ScoringWeights {
  capability: number; // Must-have capabilities
  quality: number; // Model quality
  latency: number; // Response speed
  cost: number; // Price
  availability: number; // Provider health
}

// Default scoring weights
export const DEFAULT_WEIGHTS: ScoringWeights = {
  capability: 0.35, // Capabilities are critical
  quality: 0.25,
  latency: 0.15,
  cost: 0.15,
  availability: 0.1,
};

/**
 * Score a model based on requirements and user preferences
 */
export function scoreModel(
  model: AIModel,
  providerId: string,
  providerName: string,
  requirements: TaskRequirements,
  providerHealth: { status: 'healthy' | 'degraded' | 'unhealthy' },
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ModelScore {
  const scores = {
    capability: 0,
    quality: 0,
    latency: 0,
    cost: 0,
    availability: 0,
  };

  // Capability score: Does model support required features?
  let capabilityScore = 80; // Base score

  if (requirements.supportsVision && !model.supportsVision) {
    capabilityScore = 0; // Disqualify
  }
  if (requirements.supportsTools && !model.supportsTools) {
    capabilityScore = Math.max(0, capabilityScore - 30);
  }
  if (requirements.supportsStreaming && !model.supportsStreaming) {
    capabilityScore = Math.max(0, capabilityScore - 20);
  }

  scores.capability = capabilityScore;

  // Quality score: How good is this model?
  // (In Phase 4, this comes from model metadata; will be refined in Phase 5+)
  scores.quality = model.qualityScore || 75;

  // Latency score: How fast is it?
  // (100 = sub-100ms, 50 = 500ms-1s, 0 = >5s)
  scores.latency = Math.min(100, Math.max(0, 100 - (model.speedScore || 50)));

  // Cost score: How expensive is it?
  // (100 = free, 50 = mid-range, 0 = expensive)
  scores.cost = Math.max(0, 100 - (model.costScore || 50));

  // Availability: Is provider healthy?
  switch (providerHealth.status) {
    case 'healthy':
      scores.availability = 100;
      break;
    case 'degraded':
      scores.availability = 50;
      break;
    case 'unhealthy':
      scores.availability = 0;
      break;
  }

  // Calculate weighted total score
  const totalScore =
    scores.capability * weights.capability +
    scores.quality * weights.quality +
    scores.latency * weights.latency +
    scores.cost * weights.cost +
    scores.availability * weights.availability;

  return {
    model,
    providerId,
    providerName,
    totalScore,
    scores,
    reasoning: `Selected based on: Capability (${scores.capability.toFixed(0)}), Quality (${scores.quality.toFixed(0)}), Latency (${scores.latency.toFixed(0)}), Cost (${scores.cost.toFixed(0)}), Availability (${scores.availability.toFixed(0)})`,
  };
}

/**
 * Filter models that meet minimum requirements
 */
export function filterCompatibleModels(
  models: ModelScore[],
  requirements: TaskRequirements,
  minCapabilityScore: number = 50
): ModelScore[] {
  return models.filter((ms) => {
    // Hard requirements
    if (ms.scores.capability < minCapabilityScore) {
      return false;
    }
    if (ms.scores.availability === 0) {
      return false; // Provider is down
    }

    // For local preference, only allow Ollama
    if (requirements.prefersLocal && ms.providerId !== 'ollama') {
      return false;
    }

    return true;
  });
}

/**
 * Sort models by score and return best options
 */
export function rankModels(models: ModelScore[]): ModelScore[] {
  return [...models].sort((a, b) => b.totalScore - a.totalScore);
}
