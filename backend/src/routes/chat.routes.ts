import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/chat.controller';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/conversations/:userId/messages', getMessages);
router.post('/conversations/:userId/messages', sendMessage);
router.delete('/messages/:messageId', deleteMessage);

export default router;
