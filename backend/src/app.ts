import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load env vars
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
