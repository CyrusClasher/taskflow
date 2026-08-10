import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from '../lib/validation';

// GET /api/projects/:projectId/tasks
export async function getTasksByProject(req: Request, res: Response) {
  const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const tasks = await prisma.task.findMany({
    where: { projectId: req.params.projectId },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: tasks });
}

// POST /api/projects/:projectId/tasks
export async function createTask(req: Request, res: Response) {
  const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const data = createTaskSchema.parse(req.body);

  const task = await prisma.task.create({
    data: {
      ...data,
      projectId: req.params.projectId,
    },
  });

  res.status(201).json({ success: true, data: task });
}

// GET /api/tasks/:id
export async function getTaskById(req: Request, res: Response) {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });

  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  res.status(200).json({ success: true, data: task });
}

// PUT /api/tasks/:id
export async function updateTask(req: Request, res: Response) {
  const data = updateTaskSchema.parse(req.body);

  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, 'Task not found');
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data,
  });

  res.status(200).json({ success: true, data: task });
}

// DELETE /api/tasks/:id
export async function deleteTask(req: Request, res: Response) {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, 'Task not found');
  }

  await prisma.task.delete({ where: { id: req.params.id } });

  res.status(204).send();
}

// PATCH /api/tasks/:id/status
// A dedicated endpoint for the common "just move this task to another column"
// action, so the frontend doesn't need to resend the whole task object.
export async function updateTaskStatus(req: Request, res: Response) {
  const { status } = updateTaskStatusSchema.parse(req.body);

  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, 'Task not found');
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.status(200).json({ success: true, data: task });
}
