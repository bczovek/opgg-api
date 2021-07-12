import { Router } from 'express';

const router = Router();

router.get('/:region/:division/:championName', (req, res) => {
    let params = req.originalUrl.slice(1).split('/');
    req.database.getStats(params, (err, result) => {
        if(err){
            return res.send(err);
        }
        else{
            return res.json(result);
        }
    });
});

export default router;