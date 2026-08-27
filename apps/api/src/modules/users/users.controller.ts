import { Request, Response, NextFunction } from 'express';
import { prisma } from '@noir/database';
import { AppError } from '../../middleware/error.middleware';

export class UsersController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'NOT_FOUND', 'User not found');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
