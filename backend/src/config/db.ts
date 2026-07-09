import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connects to MongoDB Atlas via Mongoose.
 * Called once at server startup (see server.ts).
 */
export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGODB_URI);

    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[db] MongoDB connection failed:', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err);
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
