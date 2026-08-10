import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { createProjectSchema, updateProjectSchema } from '../lib/validation';

// GET /api/projects
// Returns all projects along with their task list so the dashboard can show
// task counts and completed-task counts per project without extra requests.
export async function getProjects(_req: Request, res: Response) {
  const projects = await prisma.project.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: projects });
}

// GET /api/projects/:id
// Returns a single project along with its tasks.
export async function getProjectById(req: Request, res: Response) {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { tasks: { orderBy: { createdAt: 'desc' } } },
  });

  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  res.status(200).json({ success: true, data: project });
}

// POST /api/projects
export async function createProject(req: Request, res: Response) {
  const data = createProjectSchema.parse(req.body);

  const project = await prisma.project.create({ data });

  res.status(201).json({ success: true, data: project });
}

// PUT /api/projects/:id
export async function updateProject(req: Request, res: Response) {
  const data = updateProjectSchema.parse(req.body);

  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, 'Project not found');
  }

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data,
  });

  res.status(200).json({ success: true, data: project });
}

// DELETE /api/projects/:id
// Deleting a project also deletes its tasks, handled automatically by the
// `onDelete: Cascade` relation defined in the Prisma schema.
export async function deleteProject(req: Request, res: Response) {
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, 'Project not found');
  }

  await prisma.project.delete({ where: { id: req.params.id } });

  res.status(204).send();
}
