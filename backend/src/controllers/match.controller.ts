import { Request, Response } from 'express';
import { prisma } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { UnlockLevel } from '@prisma/client';

export const getMatches = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
      status: 'ACTIVE',
    },
    include: {
      userA: {
        include: { profile: true },
      },
      userB: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Format matches based on unlock level
  const formattedMatches = matches.map(match => {
    const otherUser = match.userAId === userId ? match.userB : match.userA;
    const profile = otherUser.profile!;

    // Progressive disclosure based on unlock level
    let revealedData: any = {
      matchId: match.id,
      unlockLevel: match.unlockLevel,
      compatibilityScore: match.compatibilityScore,
      createdAt: match.createdAt,
    };

    if (match.unlockLevel === UnlockLevel.MATCHED) {
      // Level 1: Just matched, minimal info
      revealedData.user = {
        id: otherUser.id,
        displayName: '???',
        initials: profile.displayName.substring(0, 2).toUpperCase(),
      };
    } else if (match.unlockLevel === UnlockLevel.PERSONALITY) {
      // Level 2: Personality unlocked
      revealedData.user = {
        id: otherUser.id,
        displayName: profile.displayName,
        age: profile.age,
        bio: profile.bio,
        interests: profile.interests,
        values: profile.values,
        relationshipGoals: profile.relationshipGoals,
      };
    } else if (match.unlockLevel === UnlockLevel.PHOTOS) {
      // Level 3: Photos unlocked
      revealedData.user = {
        id: otherUser.id,
        displayName: profile.displayName,
        age: profile.age,
        bio: profile.bio,
        interests: profile.interests,
        values: profile.values,
        relationshipGoals: profile.relationshipGoals,
        photos: profile.photos,
        avatarUrl: profile.avatarUrl,
      };
    } else {
      // Level 4: Full access
      revealedData.user = {
        id: otherUser.id,
        ...profile,
      };
    }

    return revealedData;
  });

  res.json({ matches: formattedMatches });
});

export const unlockNextLevel = asyncHandler(async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const userId = req.user!.userId;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  if (match.userAId !== userId && match.userBId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  // Determine next level
  const levelOrder = [
    UnlockLevel.MATCHED,
    UnlockLevel.PERSONALITY,
    UnlockLevel.PHOTOS,
    UnlockLevel.FULL,
  ];
  const currentIndex = levelOrder.indexOf(match.unlockLevel);

  if (currentIndex === levelOrder.length - 1) {
    throw new AppError('Already at max unlock level', 400);
  }

  const nextLevel = levelOrder[currentIndex + 1];

  // Update match
  const updated = await prisma.match.update({
    where: { id: matchId },
    data: { unlockLevel: nextLevel },
  });

  // Record unlock action
  await prisma.unlockAction.create({
    data: {
      matchId,
      userId,
      fromLevel: match.unlockLevel,
      toLevel: nextLevel,
      actionType: 'manual', // Can be 'game', 'conversation', 'time', etc.
    },
  });

  res.json({ match: updated });
});

export const getGames = asyncHandler(async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const userId = req.user!.userId;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  if (match.userAId !== userId && match.userBId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  const games = await prisma.gameParticipation.findMany({
    where: { matchId },
    orderBy: { createdAt: 'desc' },
  });

  // Available games
  const availableGames = [
    { type: '20_questions', name: '20 Questions', pointsReward: 50 },
    { type: 'would_you_rather', name: 'Would You Rather', pointsReward: 30 },
    { type: 'two_truths_lie', name: 'Two Truths and a Lie', pointsReward: 40 },
    { type: 'compatibility_quiz', name: 'Compatibility Quiz', pointsReward: 60 },
  ];

  res.json({ games, availableGames });
});

export const playGame = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement game logic
  throw new AppError('Not implemented yet', 501);
});
