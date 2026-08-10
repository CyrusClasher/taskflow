import { Router } from 'express';
import {
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController';

const router = Router();

router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
