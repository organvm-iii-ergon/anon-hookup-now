import { Request, Response } from 'express';
import { prisma } from '../index';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  // Get recent conversations
  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      deletedAt: null,
    },
    distinct: ['senderId', 'receiverId'],
    orderBy: { sentAt: 'desc' },
    take: 50,
    include: {
      sender: {
        include: { profile: true },
      },
      receiver: {
        include: { profile: true },
      },
    },
  });

  // Group by conversation partner
  const conversationMap = new Map();

  conversations.forEach(msg => {
    const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        user: msg.senderId === userId ? msg.receiver : msg.sender,
        lastMessage: msg,
      });
    }
  });

  res.json({
    conversations: Array.from(conversationMap.values()),
  });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { userId: otherUserId } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;
  const before = req.query.before as string; // Message ID for pagination

  const whereClause: any = {
    OR: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
    deletedAt: null,
  };

  if (before) {
    const beforeMessage = await prisma.message.findUnique({
      where: { id: before },
    });
    if (beforeMessage) {
      whereClause.sentAt = { lt: beforeMessage.sentAt };
    }
  }

  const messages = await prisma.message.findMany({
    where: whereClause,
    orderBy: { sentAt: 'desc' },
    take: limit,
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  res.json({
    messages: messages.reverse(),
    hasMore: messages.length === limit,
  });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { userId: receiverId } = req.params;
  const { contentEncrypted, type, mediaUrl } = req.body;

  // Check if users are blocked
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { userId, blockedUserId: receiverId },
        { userId: receiverId, blockedUserId: userId },
      ],
    },
  });

  if (block) {
    throw new AppError('Cannot send message', 403);
  }

  const message = await prisma.message.create({
    data: {
      senderId: userId,
      receiverId,
      contentEncrypted,
      type: type || 'TEXT',
      mediaUrl,
    },
  });

  // TODO: Emit WebSocket event for real-time delivery

  res.json({ message });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { messageId } = req.params;

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.senderId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
  });

  res.json({ message: 'Message deleted' });
});
