import { Router } from "express";
import { check } from "express-validator";
import { validatorHandler } from "../../middlewares/validator-handler.js";
import { FriendsRequestService } from "../../services/friends-request/index.js";

const router = Router();

router.post('/send', 
    [
        check('userIdFrom', 'Debes especificar quien envía la solicitud').isString().not().isEmpty(),
        check('userIdTo', 'Debes especificar quien recibe la solicitud').isString().not().isEmpty(),
        validatorHandler,
    ],
    async (req, res, next) => {
        try {
            const response = await new FriendsRequestService().friendRequest(req.body);
            res.status(response?.code ?? 200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

router.get('/sended/:userId', 
    async (req, res, next) => {
        try {
            const response = await new FriendsRequestService().requestSended(req.params);
            res.status(response?.code ?? 200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

router.get('/received/:userId', 
    async (req, res, next) => {
        try {
            const response = await new FriendsRequestService().requestReceived(req.params);
            res.status(response?.code ?? 200).json(response);
        } catch (error) {
            next(error)
        }
    }
);

export default router;