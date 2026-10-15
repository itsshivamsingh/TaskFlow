import { createApp } from './app';
import { connectDB, disconnectDB } from './config/db';
import { ENV } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  const app = createApp();

  // Connect to MongoDB
  const isConnected = await connectDB();
  if (!isConnected) {
    logger.warn(
      '⚠️ Starting server without active MongoDB Atlas connection.\n' +
      'Please update server/.env with your valid MONGODB_URI and restart to enable database operations.'
    );
  }

  const server = app.listen(ENV.PORT, () => {
    logger.info(`🚀 TaskFlow Backend running on http://localhost:${ENV.PORT}`);
    logger.info(`🌐 Allowed Client URL: ${ENV.CLIENT_URL}`);
    logger.info(`🩺 Health check available at: http://localhost:${ENV.PORT}/api/health`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Initiating graceful shutdown...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit if not terminated within 10 seconds
    setTimeout(() => {
      logger.error('Forceful shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error('Failed to start application:', err);
  process.exit(1);
});
