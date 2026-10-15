import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { updateProfileSchema, updatePasswordSchema } from '../validators/userValidators';

const router = Router();

router.use(requireAuth);

router.get('/me', getProfile);
router.patch('/me', validateBody(updateProfileSchema), updateProfile);
router.patch('/me/password', validateBody(updatePasswordSchema), updatePassword);
router.delete('/me', deleteAccount);

export default router;
