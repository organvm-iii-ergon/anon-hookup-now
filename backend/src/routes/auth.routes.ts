import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Registration
router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('displayName').trim().isLength({ min: 2, max: 50 }),
    body('age').isInt({ min: 18, max: 120 }),
  ],
  register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

// Refresh token
router.post('/refresh', refreshToken);

// Logout
router.post('/logout', logout);

// Email verification
router.post(
  '/verify-email',
  [body('token').notEmpty()],
  verifyEmail
);

// Password reset
router.post(
  '/forgot-password',
  authRateLimiter,
  [body('email').isEmail().normalizeEmail()],
  requestPasswordReset
);

router.post(
  '/reset-password',
  authRateLimiter,
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }),
  ],
  resetPassword
);

export default router;
