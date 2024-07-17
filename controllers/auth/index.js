import { Router } from 'express';
import passport from 'passport';
import { AuthService } from '../../services/auth/index.js';
import { validatorHandler } from '../../middlewares/validator-handler.js';
import { check } from 'express-validator';

const router = Router();

router.post('/login', 
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const response = await new AuthService().login(req.body);

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/enrollment', 
    [
        check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('avatar', 'El avatar es obligatorio').not().isEmpty(),
        validatorHandler,
    ],
    async (req, res, next) => {
        try {
            const response = await new AuthService().enrollment(req.body);
            res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

export default router;