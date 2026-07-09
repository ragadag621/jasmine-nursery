import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[server] Al-Yasmin Nursery API running on port ${env.PORT} (${env.NODE_ENV})`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`[server] ${signal} received, shutting down gracefully`);
    server.close(() => {
      console.log('[server] Closed remaining connections');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
