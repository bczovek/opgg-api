import { Router } from 'express';
import stats from './stats/index.js';

const router = Router();

router.use('/stats', stats);

router.get('/', (req, res) => {
    res.send('Nothing here...')
})

export default router;