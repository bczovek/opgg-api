import { Router } from 'express';
import stats from './stats/index.js';

const router = Router();

router.use('/stats', stats);

export default router;