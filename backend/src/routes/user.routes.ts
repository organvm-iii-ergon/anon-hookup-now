import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getMe,
  updateProfile,
  updateLocation,
  uploadPhoto,
  deletePhoto,
} from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', updateProfile);
router.post('/me/location', [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
], updateLocation);
router.post('/me/photos', uploadPhoto);
router.delete('/me/photos/:photoId', deletePhoto);

export default router;
