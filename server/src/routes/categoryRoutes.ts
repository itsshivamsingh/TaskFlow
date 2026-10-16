import { Router } from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireDatabaseConnection } from '../middleware/dbCheckMiddleware';

const router = Router();

router.use(requireAuth);
router.use(requireDatabaseConnection);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;
