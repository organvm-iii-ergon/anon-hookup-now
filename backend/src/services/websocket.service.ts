import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { redis } from '../index';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function setupWebSocket(io: Server) {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return next(new Error('Invalid token'));
    }

    socket.userId = payload.userId;
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    logger.info(`User connected via WebSocket: ${userId}`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Mark user as online
    redis.setex(`online:${userId}`, 300, '1'); // 5 minutes TTL

    // Handle presence updates
    socket.on('presence:online', async () => {
      await redis.setex(`online:${userId}`, 300, '1');
    });

    // Handle location updates
    socket.on('location:update', async (data: { latitude: number; longitude: number }) => {
      // Broadcast to nearby users (implement proximity logic)
      socket.broadcast.emit('nearby:update', {
        userId,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    // Handle typing indicators
    socket.on('chat:typing', (data: { receiverId: string; isTyping: boolean }) => {
      io.to(`user:${data.receiverId}`).emit('chat:typing', {
        senderId: userId,
        isTyping: data.isTyping,
      });
    });

    // Handle read receipts
    socket.on('chat:read', (data: { senderId: string; messageId: string }) => {
      io.to(`user:${data.senderId}`).emit('chat:read', {
        messageId: data.messageId,
        readBy: userId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${userId}`);
      await redis.del(`online:${userId}`);
    });
  });

  logger.info('WebSocket server initialized');
}

// Helper functions to emit events from other parts of the app
export function emitToUser(io: Server, userId: string, event: string, data: any) {
  io.to(`user:${userId}`).emit(event, data);
}

export function emitNewMessage(io: Server, receiverId: string, message: any) {
  emitToUser(io, receiverId, 'message:new', message);
}

export function emitNewMatch(io: Server, userId: string, match: any) {
  emitToUser(io, userId, 'match:new', match);
}
