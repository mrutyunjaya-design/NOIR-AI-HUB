import { prisma } from '@noir/database';

export const initializeDatabase = async () => {
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  await prisma.$disconnect();
};

export { prisma };
