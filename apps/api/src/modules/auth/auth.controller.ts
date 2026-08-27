import { Request, Response, NextFunction } from 'express';
import { validateRequest, ValidationSchema } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation';
import { AuthService } from './auth.service';
import { AppError } from '../../middleware/error.middleware';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await authService.login(req.body);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return access token in body
      res.json({
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      await authService.logout(req.userId);

      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new AppError(401, 'MISSING_TOKEN', 'Refresh token is required');
      }

      const response = await authService.refreshAccessToken(refreshToken);

      // Update cookie with new token
      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
