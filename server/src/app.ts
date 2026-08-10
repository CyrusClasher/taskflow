import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import taskDetailRoutes from './routes/taskDetailRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Allow the frontend (running on a different origin/port) to call this API.
// In production, set CORS_ORIGIN to your deployed frontend URL.
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));

// Parse incoming JSON request bodies
app.use(express.json());

// Simple health check route so we can confirm the server is running
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

// /api/projects and /api/projects/:projectId/tasks
app.use('/api/projects', projectRoutes);

// /api/tasks/:id, /api/tasks/:id/status
app.use('/api/tasks', taskDetailRoutes);

// Anything else under /api that didn't match a route above
app.use('/api', notFoundHandler);

// Centralized error handler — must be registered last
app.use(errorHandler);

export default app;
