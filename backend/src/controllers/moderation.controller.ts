import { Request, Response } from 'express';
import { prisma } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const reportUser = asyncHandler(async (req: Request, res: Response) => {
  const reporterId = req.user!.userId;
  const { reportedUserId, reason, description } = req.body;

  if (!reportedUserId || !reason) {
    throw new AppError('Missing required fields', 400);
  }

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedUserId,
      reason,
      description,
    },
  });

  res.json({
    message: 'Report submitted successfully',
    reportId: report.id,
  });
});

export const getSafetyResources = asyncHandler(async (req: Request, res: Response) => {
  const resources = [
    {
      title: 'Safety Tips',
      items: [
        'Meet in public places',
        'Tell a friend where you\'re going',
        'Trust your instincts',
        'Don\'t share personal information too quickly',
        'Video chat before meeting in person',
      ],
    },
    {
      title: 'STI Prevention',
      links: [
        { name: 'CDC STI Information', url: 'https://www.cdc.gov/std/' },
        { name: 'WHO Sexual Health', url: 'https://www.who.int/health-topics/sexual-health' },
      ],
    },
    {
      title: 'Mental Health Resources',
      links: [
        { name: 'National Suicide Prevention Lifeline', phone: '988' },
        { name: 'Crisis Text Line', phone: 'Text HOME to 741741' },
      ],
    },
  ];

  res.json({ resources });
});
