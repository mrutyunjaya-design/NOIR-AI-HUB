import { Request, Response } from 'express';
import { prisma } from '@noir/database';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: String(error),
      timestamp: new Date().toISOString(),
    });
  }
};
