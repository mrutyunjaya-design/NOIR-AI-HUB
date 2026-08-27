/**
 * Task detection and routing logic
 */

export enum TaskType {
  CHAT = 'chat',
  CODING = 'coding',
  RESEARCH = 'research',
  REASONING = 'reasoning',
  VISION = 'vision',
  WRITING = 'writing',
  SUMMARIZATION = 'summarization',
}

export interface TaskRequirements {
  type: TaskType;
  supportsVision: boolean;
  supportsTools: boolean;
  supportsStreaming: boolean;
  needsWeb: boolean;
  needsReasoning: boolean;
  costSensitive: boolean;
  prefersSpeed: boolean;
  prefersQuality: boolean;
  prefersLocal: boolean;
}

/**
 * Detect task type from user request
 */
export function detectTaskType(message: string): TaskType {
  const lowerMessage = message.toLowerCase();

  // Coding detection
  if (
    lowerMessage.includes('code') ||
    lowerMessage.includes('program') ||
    lowerMessage.includes('function') ||
    lowerMessage.includes('debug') ||
    lowerMessage.includes('implement') ||
    lowerMessage.includes('python') ||
    lowerMessage.includes('javascript') ||
    lowerMessage.includes('typescript')
  ) {
    return TaskType.CODING;
  }

  // Research/Web detection
  if (
    lowerMessage.includes('search') ||
    lowerMessage.includes('research') ||
    lowerMessage.includes('find') ||
    lowerMessage.includes('latest') ||
    lowerMessage.includes('current')
  ) {
    return TaskType.RESEARCH;
  }

  // Reasoning detection
  if (
    lowerMessage.includes('reason') ||
    lowerMessage.includes('explain') ||
    lowerMessage.includes('why') ||
    lowerMessage.includes('problem') ||
    lowerMessage.includes('solve')
  ) {
    return TaskType.REASONING;
  }

  // Writing detection
  if (
    lowerMessage.includes('write') ||
    lowerMessage.includes('create') ||
    lowerMessage.includes('essay') ||
    lowerMessage.includes('story') ||
    lowerMessage.includes('content')
  ) {
    return TaskType.WRITING;
  }

  // Summarization detection
  if (
    lowerMessage.includes('summariz') ||
    lowerMessage.includes('tl;dr') ||
    lowerMessage.includes('brief')
  ) {
    return TaskType.SUMMARIZATION;
  }

  // Default to chat
  return TaskType.CHAT;
}

/**
 * Determine requirements from task type and user preferences
 */
export function determineRequirements(
  taskType: TaskType,
  hasImages: boolean,
  userPreferences?: {
    costLimit?: number;
    prefersLocal?: boolean;
    preferredProvider?: string;
  }
): TaskRequirements {
  const requirements: TaskRequirements = {
    type: taskType,
    supportsVision: hasImages,
    supportsTools: false,
    supportsStreaming: true,
    needsWeb: taskType === TaskType.RESEARCH,
    needsReasoning: taskType === TaskType.REASONING,
    costSensitive: userPreferences?.costLimit ? true : false,
    prefersSpeed: taskType === TaskType.CHAT,
    prefersQuality: taskType === TaskType.REASONING || taskType === TaskType.WRITING,
    prefersLocal: userPreferences?.prefersLocal ?? false,
  };

  // Coding may benefit from tools
  if (taskType === TaskType.CODING) {
    requirements.supportsTools = true;
    requirements.prefersQuality = true;
  }

  // Reasoning definitely needs tools
  if (taskType === TaskType.REASONING) {
    requirements.supportsTools = true;
  }

  return requirements;
}
