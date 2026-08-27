import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed providers
  const openai = await prisma.provider.upsert({
    where: { slug: 'openai' },
    update: {},
    create: {
      slug: 'openai',
      name: 'OpenAI',
      description: 'Advanced AI models including GPT-4, GPT-3.5 Turbo',
      category: 'CHAT',
      website: 'https://openai.com',
      enabled: true,
      pricing: {
        create: {
          inputCostPer1k: 0.0003,
          outputCostPer1k: 0.0006,
        },
      },
    },
  });

  const gemini = await prisma.provider.upsert({
    where: { slug: 'gemini' },
    update: {},
    create: {
      slug: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s advanced AI models',
      category: 'CHAT',
      website: 'https://ai.google.dev',
      enabled: true,
      pricing: {
        create: {
          inputCostPer1k: 0.00005,
          outputCostPer1k: 0.00015,
        },
      },
    },
  });

  const anthropic = await prisma.provider.upsert({
    where: { slug: 'anthropic' },
    update: {},
    create: {
      slug: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Claude LLM models',
      category: 'CHAT',
      website: 'https://anthropic.com',
      enabled: true,
      pricing: {
        create: {
          inputCostPer1k: 0.003,
          outputCostPer1k: 0.015,
        },
      },
    },
  });

  const ollama = await prisma.provider.upsert({
    where: { slug: 'ollama' },
    update: {},
    create: {
      slug: 'ollama',
      name: 'Ollama',
      description: 'Local open-source LLMs',
      category: 'LOCAL',
      website: 'https://ollama.ai',
      enabled: true,
      pricing: {
        create: {
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
      },
    },
  });

  // Seed models for OpenAI
  await prisma.model.upsert({
    where: { providerId_slug: { providerId: openai.id, slug: 'gpt-4-turbo' } },
    update: {},
    create: {
      providerId: openai.id,
      slug: 'gpt-4-turbo',
      displayName: 'GPT-4 Turbo',
      description: 'OpenAI\'s most advanced model',
      supportsText: true,
      supportsVision: true,
      supportsTools: true,
      supportsStreaming: true,
      contextWindow: 128000,
      maxTokens: 4096,
      qualityScore: 95,
      speedScore: 85,
      accessType: 'PAID_API',
      pricing: {
        create: {
          inputCostPer1k: 0.01,
          outputCostPer1k: 0.03,
        },
      },
      capabilities: {
        create: [
          { capability: 'chat' },
          { capability: 'vision' },
          { capability: 'code' },
          { capability: 'reasoning' },
          { capability: 'tools' },
        ],
      },
    },
  });

  await prisma.model.upsert({
    where: { providerId_slug: { providerId: openai.id, slug: 'gpt-3.5-turbo' } },
    update: {},
    create: {
      providerId: openai.id,
      slug: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      description: 'Fast and cost-effective model',
      supportsText: true,
      supportsStreaming: true,
      contextWindow: 4096,
      maxTokens: 2048,
      qualityScore: 80,
      speedScore: 95,
      accessType: 'PAID_API',
      pricing: {
        create: {
          inputCostPer1k: 0.0005,
          outputCostPer1k: 0.0015,
        },
      },
      capabilities: {
        create: [{ capability: 'chat' }, { capability: 'code' }],
      },
    },
  });

  // Seed models for Gemini
  await prisma.model.upsert({
    where: { providerId_slug: { providerId: gemini.id, slug: 'gemini-pro' } },
    update: {},
    create: {
      providerId: gemini.id,
      slug: 'gemini-pro',
      displayName: 'Gemini Pro',
      description: 'Google\'s advanced chat model',
      supportsText: true,
      supportsVision: true,
      supportsStreaming: true,
      contextWindow: 32768,
      maxTokens: 8192,
      qualityScore: 90,
      speedScore: 90,
      accessType: 'FREEMIUM',
      freeQuotaLimit: 60,
      pricing: {
        create: {
          inputCostPer1k: 0.00005,
          outputCostPer1k: 0.00015,
        },
      },
      capabilities: {
        create: [
          { capability: 'chat' },
          { capability: 'vision' },
          { capability: 'code' },
        ],
      },
    },
  });

  // Seed models for Anthropic
  await prisma.model.upsert({
    where: { providerId_slug: { providerId: anthropic.id, slug: 'claude-3-opus' } },
    update: {},
    create: {
      providerId: anthropic.id,
      slug: 'claude-3-opus',
      displayName: 'Claude 3 Opus',
      description: 'Most capable Claude model',
      supportsText: true,
      supportsVision: true,
      supportsTools: true,
      supportsStreaming: true,
      contextWindow: 200000,
      maxTokens: 4096,
      qualityScore: 95,
      speedScore: 80,
      accessType: 'PAID_API',
      pricing: {
        create: {
          inputCostPer1k: 0.015,
          outputCostPer1k: 0.075,
        },
      },
      capabilities: {
        create: [
          { capability: 'chat' },
          { capability: 'vision' },
          { capability: 'code' },
          { capability: 'reasoning' },
        ],
      },
    },
  });

  // Seed models for Ollama (stubs - actual models run locally)
  await prisma.model.upsert({
    where: { providerId_slug: { providerId: ollama.id, slug: 'llama2' } },
    update: {},
    create: {
      providerId: ollama.id,
      slug: 'llama2',
      displayName: 'Llama 2',
      description: 'Meta\'s open-source model (local)',
      supportsText: true,
      supportsStreaming: true,
      qualityScore: 75,
      speedScore: 90,
      accessType: 'LOCAL',
      requiresApiKey: false,
      pricing: {
        create: {
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
      },
      capabilities: {
        create: [{ capability: 'chat' }, { capability: 'code' }],
      },
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
