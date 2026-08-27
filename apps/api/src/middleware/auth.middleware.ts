import { Request, Response, NextFunction } from 'express';
import { prisma } from '@noir/database';
import { verifyAccessToken } from '@noir/auth';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication failed',
    });
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = verifyAccessToken(token);

      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });

        if (user) {
          req.userId = user.id;
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Optional auth, so we don't fail on error
    next();
  }
};
