import { Router } from 'express';

const router = Router();

router.get('/:region/:division/:championName', (req, res) => {
    let params = req.originalUrl.slice(1).split('/');
    req.database.getStats(params, (result, error) => {
        if(error){
            return res.status(500).send("Internal server error").end();
        }
        
        if(result.length > 0){
            return res.json(result);
        }
        
        return res.status(404).send("Not found").end();
        
    });
});

export default router;