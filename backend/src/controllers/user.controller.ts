import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { jitterLocation, isValidCoordinates } from '../utils/location';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      locations: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      mode: user.mode,
      lastSeen: user.lastSeen,
      profile: user.profile,
      location: user.locations[0] || null,
    },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const updates = req.body;

  // Filter allowed fields
  const allowedFields = [
    'displayName', 'bio', 'height', 'weight', 'bodyType',
    'ethnicity', 'tribe', 'interests', 'lookingFor',
    'relationshipGoals', 'values', 'showDistance',
    'showAge', 'showLastSeen', 'invisibleMode', 'exactLocation'
  ];

  const filteredUpdates: any = {};
  for (const field of allowedFields) {
    if (field in updates) {
      filteredUpdates[field] = updates[field];
    }
  }

  const profile = await prisma.profile.update({
    where: { userId },
    data: filteredUpdates,
  });

  res.json({ profile });
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid coordinates', 400);
  }

  const userId = req.user!.userId;
  const { latitude, longitude, accuracy } = req.body;

  if (!isValidCoordinates(latitude, longitude)) {
    throw new AppError('Invalid coordinates', 400);
  }

  // Create new location entry
  const location = await prisma.userLocation.create({
    data: {
      userId,
      latitude,
      longitude,
      accuracy,
    },
  });

  // Update user's last seen
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeen: new Date() },
  });

  res.json({ location });
});

export const uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement file upload with multer and S3
  throw new AppError('Not implemented yet', 501);
});

export const deletePhoto = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement photo deletion
  throw new AppError('Not implemented yet', 501);
});
