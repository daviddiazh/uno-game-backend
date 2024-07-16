import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
    res.json({
        hello: 'Hello World!'
    })
});

export default router;