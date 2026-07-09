import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRouter from './routes';
import { notFound } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

const app: Application = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required so the httpOnly auth cookie is sent/received cross-origin
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Logging ---
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// --- Routes ---
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mishtelet Al-Yasmin API — see /api/health',
  });
});

app.use('/api', apiRouter);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
