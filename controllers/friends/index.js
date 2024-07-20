import { Router } from "express";
import { check } from "express-validator";
import { validatorHandler } from "../../middlewares/validator-handler.js";
import { FriendsService } from "../../services/friends/index.js";

const router = Router();

router.post('/acept',
    [
        check('userIdFrom', 'El ID del usuario solicitante es obligatorio').not().isEmpty(),
        check('userIdTo', 'El ID del usuario receptor es obligatorio').not().isEmpty(),
        validatorHandler,
    ],
    async (req, res, next) => {
        try {
            const response = await new FriendsService().aceptRequest(req.body);
            res.status(response?.code ?? 200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

router.get('/list/:userId',
    async (req, res, next) => {
        try {
            const response = await new FriendsService().friendsList(req.params);
            res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

export default router;