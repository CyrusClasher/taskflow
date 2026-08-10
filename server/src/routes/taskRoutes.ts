import { Router } from 'express';
import { getTasksByProject, createTask } from '../controllers/taskController';

// mergeParams lets this router read :projectId from the parent router
// (projectRoutes) when mounted at /api/projects/:projectId/tasks
const router = Router({ mergeParams: true });

router.get('/', getTasksByProject);
router.post('/', createTask);

export default router;
