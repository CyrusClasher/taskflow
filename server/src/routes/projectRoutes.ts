import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import taskRoutes from './taskRoutes';

const router = Router();

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Nested task routes: /api/projects/:projectId/tasks
router.use('/:projectId/tasks', taskRoutes);

export default router;
