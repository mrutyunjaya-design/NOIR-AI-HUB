import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { generalRateLimiter } from './middleware/rate-limit.middleware';
import apiRoutes from './routes/index';
import { env } from './config/env';
import { Logger } from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Compression
app.use(compression());

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request tracking
app.use(requestIdMiddleware);

// Rate limiting
app.use(generalRateLimiter);

// API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorMiddleware);

export const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize Redis
    await initializeRedis();

    // Start listening
    const server = app.listen(env.API_PORT, env.API_HOST, () => {
      Logger.info(
        `🚀 API Server running at http://${env.API_HOST}:${env.API_PORT}`
      );
      Logger.info(`📚 API Documentation: http://${env.API_HOST}:${env.API_PORT}/api/v1`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      Logger.info('Shutting down gracefully...');
      server.close(() => {
        Logger.info('Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    Logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
};

export default app;
