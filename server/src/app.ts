import express from 'express';
import cors from 'cors';

const app = express();

// Allow the frontend (running on a different port) to call this API
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Simple health check route so we can confirm the server is running.
// This will be replaced/extended with real /api routes in Phase 3.
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

export default app;
