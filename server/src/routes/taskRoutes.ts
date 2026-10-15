import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validateMiddleware';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema,
} from '../validators/taskValidators';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(taskQuerySchema), getTasks);
router.post('/', validateBody(createTaskSchema), createTask);
router.get('/:id', getTaskById);
router.patch('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', validateBody(updateTaskStatusSchema), updateTaskStatus);

export default router;
