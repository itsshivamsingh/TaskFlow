import { Router } from 'express';
import { getDashboardStats, getWeeklyProductivity } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireDatabaseConnection } from '../middleware/dbCheckMiddleware';

const router = Router();

router.use(requireAuth);
router.use(requireDatabaseConnection);

router.get('/stats', getDashboardStats);
router.get('/productivity', getWeeklyProductivity);

export default router;
