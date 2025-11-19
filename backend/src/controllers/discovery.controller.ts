import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { calculateDistance, roundDistance, jitterLocation } from '../utils/location';

const MAX_DISTANCE_KM = parseFloat(process.env.MAX_DISCOVERY_DISTANCE_KM || '100');
const LOCATION_JITTER_METERS = parseFloat(process.env.LOCATION_JITTER_METERS || '100');

export const getGridView = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const userId = req.user!.userId;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  const maxDistance = parseFloat(req.query.maxDistance as string) || MAX_DISTANCE_KM;

  // Get user's location
  const userLocation = await prisma.userLocation.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  if (!userLocation) {
    throw new AppError('Location not set. Please update your location first.', 400);
  }

  // Get blocked users
  const blocks = await prisma.block.findMany({
    where: {
      OR: [
        { userId },
        { blockedUserId: userId },
      ],
    },
  });
  const blockedUserIds = blocks.map(b => b.userId === userId ? b.blockedUserId : b.userId);

  // Find nearby users (simplified query - in production use PostGIS)
  const nearbyUsers = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...blockedUserIds] },
      banned: false,
      profile: {
        invisibleMode: false,
      },
    },
    include: {
      profile: true,
      locations: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
    take: limit * 2, // Get more to filter by distance
  });

  // Calculate distances and filter
  const usersWithDistance = nearbyUsers
    .filter(user => user.locations.length > 0)
    .map(user => {
      const loc = user.locations[0];
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        loc.latitude,
        loc.longitude
      );

      return {
        user,
        distance,
        location: loc,
      };
    })
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(offset, offset + limit);

  // Format response with privacy controls
  const profiles = usersWithDistance.map(({ user, distance, location }) => {
    const profile = user.profile!;
    const jitteredLocation = profile.exactLocation
      ? { latitude: location.latitude, longitude: location.longitude }
      : jitterLocation(location.latitude, location.longitude, LOCATION_JITTER_METERS);

    return {
      id: user.id,
      displayName: profile.displayName,
      age: profile.showAge ? profile.age : null,
      photos: profile.photos,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      tribe: profile.tribe,
      interests: profile.interests,
      distance: profile.showDistance ? roundDistance(distance) : null,
      location: jitteredLocation,
      lastSeen: profile.showLastSeen ? user.lastSeen : null,
      verificationStatus: profile.verificationStatus,
    };
  });

  res.json({
    profiles,
    total: profiles.length,
    hasMore: usersWithDistance.length === limit,
  });
});

export const getMapView = asyncHandler(async (req: Request, res: Response) => {
  // Similar to grid view but optimized for map display
  // TODO: Implement clustering for privacy
  throw new AppError('Not implemented yet', 501);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId: targetUserId } = req.params;
  const currentUserId = req.user!.userId;

  // Check if blocked
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { userId: currentUserId, blockedUserId: targetUserId },
        { userId: targetUserId, blockedUserId: currentUserId },
      ],
    },
  });

  if (block) {
    throw new AppError('User not found', 404);
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      profile: true,
      locations: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user || user.banned) {
    throw new AppError('User not found', 404);
  }

  // Record profile view
  await prisma.profileView.create({
    data: {
      viewerId: currentUserId,
      viewedUserId: targetUserId,
    },
  });

  res.json({ user });
});

export const favoriteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId: favoritedUserId } = req.params;
  const userId = req.user!.userId;

  await prisma.favorite.create({
    data: {
      userId,
      favoritedUserId,
    },
  });

  res.json({ message: 'User favorited' });
});

export const unfavoriteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId: favoritedUserId } = req.params;
  const userId = req.user!.userId;

  await prisma.favorite.deleteMany({
    where: {
      userId,
      favoritedUserId,
    },
  });

  res.json({ message: 'User unfavorited' });
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId: blockedUserId } = req.params;
  const userId = req.user!.userId;

  await prisma.block.create({
    data: {
      userId,
      blockedUserId,
    },
  });

  res.json({ message: 'User blocked' });
});
