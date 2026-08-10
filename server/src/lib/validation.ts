import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
});

// Same as create, but every field is optional since an update might only
// change one field at a time.
export const updateProjectSchema = createProjectSchema.partial();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(150, 'Task title is too long'),
  description: z.string().trim().max(1000, 'Description is too long').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.coerce.date({ message: 'Due date must be a valid date' }).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    message: 'Status must be TODO, IN_PROGRESS, or DONE',
  }),
});
