import { Router } from 'express';
import { validateRequest } from '../../middleware/validation.middleware';
import { authRateLimiter } from '../../middleware/rate-limit.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation';

const router = Router();

// Register
router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  AuthController.register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  AuthController.login
);

// Logout
router.post('/logout', authMiddleware, AuthController.logout);

// Refresh token
router.post(
  '/refresh',
  validateRequest({ body: refreshTokenSchema }),
  AuthController.refresh
);

export default router;
