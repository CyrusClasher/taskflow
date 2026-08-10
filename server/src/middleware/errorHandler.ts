import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// A small custom error class lets controllers throw a specific status code
// and message (e.g. `throw new AppError(404, 'Task not found')`) instead of
// manually calling res.status(...).json(...) everywhere.
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Centralized error handler. Because Express 5 automatically forwards errors
// thrown inside async route handlers to this middleware, controllers can
// just `throw` and don't need try/catch + next(err) boilerplate everywhere.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // Known, expected errors (e.g. "not found") — send the specific status/message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Zod validation errors — return a 400 with a readable message
  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => issue.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Prisma "record not found" error (P2025) — surface as a clean 404
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  // Anything else is unexpected — log it for debugging but never leak internal
  // details (stack traces, DB errors, etc.) to the client.
  console.error(err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
}

// Catches requests to routes that don't exist (e.g. GET /api/nonsense)
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Route not found' });
}
