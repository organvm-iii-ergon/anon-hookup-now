import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getGridView,
  getMapView,
  getProfile,
  favoriteUser,
  unfavoriteUser,
  blockUser,
} from '../controllers/discovery.controller';

const router = Router();

router.use(authenticate);

// Grid view (Grindr-style)
router.get('/grid', [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('maxDistance').optional().isFloat({ min: 0.1, max: 100 }),
], getGridView);

// Map view (Sniffies-style)
router.get('/map', [
  query('bounds').optional(), // format: "minLat,minLon,maxLat,maxLon"
], getMapView);

// User profile
router.get('/users/:userId', getProfile);

// Favorites
router.post('/users/:userId/favorite', favoriteUser);
router.delete('/users/:userId/favorite', unfavoriteUser);

// Block
router.post('/users/:userId/block', blockUser);

export default router;
