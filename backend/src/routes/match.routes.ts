import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getMatches,
  unlockNextLevel,
  getGames,
  playGame,
} from '../controllers/match.controller';

const router = Router();

router.use(authenticate);

router.get('/', getMatches);
router.post('/:matchId/unlock', unlockNextLevel);
router.get('/:matchId/games', getGames);
router.post('/:matchId/games/:gameType', playGame);

export default router;
