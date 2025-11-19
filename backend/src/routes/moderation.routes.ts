import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { reportUser, getSafetyResources } from '../controllers/moderation.controller';

const router = Router();

router.post('/reports', authenticate, reportUser);
router.get('/safety', getSafetyResources);

export default router;
