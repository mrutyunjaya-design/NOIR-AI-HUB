/**
 * Main NOIR Router implementation
 */

import { AIProvider, getProvider, getAllProviders } from '@noir/providers';
import { prisma } from '@noir/database';
import { TaskType, detectTaskType, determineRequirements } from './task';
import { scoreModel, rankModels, filterCompatibleModels, ModelScore } from './scoring';
import { checkRateLimit, checkBudget, RateLimitError } from './limits';
import { ROUTER_CONFIG } from './config';

export interface RouterRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string; // Optional: user-specified model
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface RouterResponse {
  provider: AIProvider;
  model: {
    id: string;
    name: string;
    displayName: string;
  };
  score: ModelScore;
  reasoning: string;
}

export interface RouterOptions {
  userId: string;
  request: RouterRequest;
  preferPrivate?: boolean;
  maxCostPerRequest?: number;
  forceProvider?: string; // Force a specific provider (admin/testing)
}

export class NoirRouter {
  /**
   * Select the best model and provider for a user request
   */
  async selectModel(options: RouterOptions): Promise<RouterResponse> {
    const { userId, request, preferPrivate, maxCostPerRequest, forceProvider } = options;

    // 1. Validate request
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Request must contain at least one message');
    }

    // 2. Get user and subscription info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const subscription = user.subscriptions[0];
    if (!subscription) {
      throw new Error('No subscription found');
    }

    // 3. Check rate limits
    await checkRateLimit(userId, subscription.tier);

    // 4. Detect task type
    const userMessage = request.messages[request.messages.length - 1]?.content || '';
    const taskType = detectTaskType(userMessage);

    // 5. Determine requirements
    const hasImages = userMessage.includes('[image]'); // Simple detection
    const requirements = determineRequirements(taskType, hasImages, {
      costLimit: maxCostPerRequest,
      prefersLocal: preferPrivate,
    });

    // 6. If user forced a provider, use only that one
    let providers: AIProvider[] = [];
    if (forceProvider) {
      const provider = getProvider(forceProvider);
      if (!provider) {
        throw new Error(`Provider not found: ${forceProvider}`);
      }
      providers = [provider];
    } else {
      providers = getAllProviders();
    }

    if (providers.length === 0) {
      throw new Error('No providers available');
    }

    // 7. Score all models from all providers
    const allScores: ModelScore[] = [];

    for (const provider of providers) {
      try {
        // Check provider health
        const health = await provider.healthCheck();

        // Get models
        const models = await provider.listModels();

        // Score each model
        for (const model of models) {
          const taskWeights =
            ROUTER_CONFIG.taskSpecificWeights[taskType as keyof typeof ROUTER_CONFIG.taskSpecificWeights] ||
            ROUTER_CONFIG.scoring.weights;

          const score = scoreModel(
            model,
            provider.id,
            provider.name,
            requirements,
            health,
            taskWeights
          );

          allScores.push(score);
        }
      } catch (error) {
        console.warn(`Failed to score provider ${provider.name}:`, error);
        // Continue with other providers
      }
    }

    if (allScores.length === 0) {
      throw new Error('No models available for this request');
    }

    // 8. Filter compatible models
    const compatible = filterCompatibleModels(
      allScores,
      requirements,
      ROUTER_CONFIG.scoring.minCapabilityScore
    );

    if (compatible.length === 0) {
      throw new Error(
        `No models available that support required capabilities. Required: Vision=${requirements.supportsVision}, Tools=${requirements.supportsTools}`
      );
    }

    // 9. Rank by score
    const ranked = rankModels(compatible);
    const bestScore = ranked[0];

    // 10. Check estimated cost
    const estimatedCost = await this.estimateCost(bestScore.model);
    if (maxCostPerRequest && estimatedCost > maxCostPerRequest) {
      throw new Error(
        `Estimated cost ($${estimatedCost.toFixed(4)}) exceeds limit ($${maxCostPerRequest.toFixed(4)}). Cheapest option: $${ranked[ranked.length - 1]}`
      );
    }

    // 11. Return selection
    const provider = getProvider(bestScore.providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${bestScore.providerId}`);
    }

    return {
      provider,
      model: {
        id: bestScore.model.id,
        name: bestScore.model.name,
        displayName: bestScore.model.displayName,
      },
      score: bestScore,
      reasoning: bestScore.reasoning,
    };
  }

  /**
   * Execute a request through selected provider with fallback support
   */
  async executeWithFallback(
    selection: RouterResponse,
    request: RouterRequest,
    userId: string
  ): Promise<any> {
    let lastError: Error | null = null;
    let retries = 0;
    const maxRetries = ROUTER_CONFIG.fallback.maxRetries;

    while (retries < maxRetries) {
      try {
        // Log the attempt
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'model_execution',
            resourceType: 'message',
            status: 'pending',
            message: `Attempt ${retries + 1}: ${selection.provider.name}/${selection.model.displayName}`,
          },
        });

        // Execute
        const response = await selection.provider.chat(request);

        // Log success
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'model_execution',
            resourceType: 'message',
            status: 'success',
            message: `Executed successfully`,
          },
        });

        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`Execution failed (attempt ${retries + 1}):`, error);

        retries++;
        if (retries < maxRetries) {
          // Exponential backoff
          const delayMs = ROUTER_CONFIG.fallback.initialDelayMs * Math.pow(ROUTER_CONFIG.fallback.backoffMultiplier, retries - 1);
          console.log(`Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    // Log final failure
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'model_execution',
        resourceType: 'message',
        status: 'failed',
        message: `Failed after ${maxRetries} attempts: ${lastError?.message}`,
      },
    });

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Estimate cost of a request to a model
   */
  private async estimateCost(model: any): Promise<number> {
    // Base estimate: assume 100 input tokens, 100 output tokens
    // (Real implementation would use token counter)
    const inputTokens = 100;
    const outputTokens = 100;

    const modelPricing = await prisma.modelPricing.findUnique({
      where: { modelId: model.id },
    });

    if (!modelPricing) {
      return 0; // Free model
    }

    const inputCost = (inputTokens / 1000) * modelPricing.inputCostPer1k;
    const outputCost = (outputTokens / 1000) * modelPricing.outputCostPer1k;

    return inputCost + outputCost;
  }
}
