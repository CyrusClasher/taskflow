import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../lib/validation";

const getParamString = (
  param: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
};

// GET /api/projects/:projectId/tasks
export async function getTasksByProject(req: Request, res: Response) {
  const projectId = getParamString(req.params.projectId);
  if (!projectId) {
    throw new AppError(400, "Project ID is required");
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError(404, "Project not found");
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ success: true, data: tasks });
}

// POST /api/projects/:projectId/tasks
export async function createTask(req: Request, res: Response) {
  const projectId = getParamString(req.params.projectId);
  if (!projectId) {
    throw new AppError(400, "Project ID is required");
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError(404, "Project not found");
  }

  const data = createTaskSchema.parse(req.body);

  const task = await prisma.task.create({
    data: {
      ...data,
      projectId,
    },
  });

  res.status(201).json({ success: true, data: task });
}

// GET /api/tasks/:id
export async function getTaskById(req: Request, res: Response) {
  const taskId = getParamString(req.params.id);
  if (!taskId) {
    throw new AppError(400, "Task ID is required");
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  res.status(200).json({ success: true, data: task });
}

// PUT /api/tasks/:id
export async function updateTask(req: Request, res: Response) {
  const taskId = getParamString(req.params.id);
  if (!taskId) {
    throw new AppError(400, "Task ID is required");
  }

  const data = updateTaskSchema.parse(req.body);

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) {
    throw new AppError(404, "Task not found");
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  res.status(200).json({ success: true, data: task });
}

// DELETE /api/tasks/:id
export async function deleteTask(req: Request, res: Response) {
  const taskId = getParamString(req.params.id);
  if (!taskId) {
    throw new AppError(400, "Task ID is required");
  }

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) {
    throw new AppError(404, "Task not found");
  }

  await prisma.task.delete({ where: { id: taskId } });

  res.status(204).send();
}

// PATCH /api/tasks/:id/status
// A dedicated endpoint for the common "just move this task to another column"
// action, so the frontend doesn't need to resend the whole task object.
export async function updateTaskStatus(req: Request, res: Response) {
  const taskId = getParamString(req.params.id);
  if (!taskId) {
    throw new AppError(400, "Task ID is required");
  }

  const { status } = updateTaskStatusSchema.parse(req.body);

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) {
    throw new AppError(404, "Task not found");
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  res.status(200).json({ success: true, data: task });
}
