import { Router } from 'express';
import { getDashboardStats, getWeeklyProductivity } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/stats', getDashboardStats);
router.get('/productivity', getWeeklyProductivity);

export default router;
