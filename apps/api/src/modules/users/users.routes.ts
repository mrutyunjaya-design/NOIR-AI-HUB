import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { UsersController } from './users.controller';

const router = Router();

router.get('/me', authMiddleware, UsersController.getMe);

export default router;
