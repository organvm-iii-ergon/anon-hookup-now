import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { prisma, redis } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed: ' + errors.array().map(e => e.msg).join(', '), 400);
  }

  const { email, password, displayName, age } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user and profile in transaction
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          displayName,
          age,
          photos: [],
          interests: [],
          tribe: [],
          lookingFor: [],
          values: [],
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Generate verification token (in production, send via email)
  const verificationToken = uuidv4();
  await redis.setex(`email-verify:${verificationToken}`, 86400, user.id); // 24 hours

  logger.info(`New user registered: ${user.id}`);

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

  // Store refresh token in Redis
  await redis.setex(`refresh-token:${user.id}`, 604800, refreshToken); // 7 days

  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
    verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined,
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is banned
  if (user.banned) {
    throw new AppError('Account has been banned', 403);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last seen
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeen: new Date() },
  });

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

  // Store refresh token in Redis
  await redis.setex(`refresh-token:${user.id}`, 604800, refreshToken); // 7 days

  logger.info(`User logged in: ${user.id}`);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      profile: user.profile,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token required', 401);
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check if refresh token exists in Redis
  const storedToken = await redis.get(`refresh-token:${payload.userId}`);
  if (storedToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Generate new access token
  const accessToken = generateAccessToken({ userId: payload.userId, email: payload.email });

  res.json({
    accessToken,
  });
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload) {
      // Remove refresh token from Redis
      await redis.del(`refresh-token:${payload.userId}`);
    }
  }

  res.json({
    message: 'Logout successful',
  });
});

/**
 * Verify email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const userId = await redis.get(`email-verify:${token}`);
  if (!userId) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  await redis.del(`email-verify:${token}`);

  res.json({
    message: 'Email verified successfully',
  });
});

/**
 * Request password reset
 */
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Don't reveal if user exists
  if (!user) {
    return res.json({
      message: 'If the email exists, a password reset link has been sent',
    });
  }

  const resetToken = uuidv4();
  await redis.setex(`password-reset:${resetToken}`, 3600, user.id); // 1 hour

  logger.info(`Password reset requested for user: ${user.id}`);

  // In production, send email with reset link
  res.json({
    message: 'If the email exists, a password reset link has been sent',
    resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
  });
});

/**
 * Reset password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const userId = await redis.get(`password-reset:${token}`);
  if (!userId) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await redis.del(`password-reset:${token}`);

  // Invalidate all refresh tokens
  await redis.del(`refresh-token:${userId}`);

  logger.info(`Password reset completed for user: ${userId}`);

  res.json({
    message: 'Password reset successful',
  });
});
