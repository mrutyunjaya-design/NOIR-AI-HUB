import { Router } from 'express';
import { healthCheck } from './health';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';

const router = Router();

// Health check
router.get('/health', healthCheck);

// API routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
// More routes to be added in next phases:
// router.use('/conversations', conversationRoutes);
// router.use('/messages', messageRoutes);
// router.use('/providers', providerRoutes);
// router.use('/models', modelRoutes);
// router.use('/chat', chatRoutes);
// router.use('/usage', usageRoutes);
// router.use('/admin', adminRoutes);

export default router;
