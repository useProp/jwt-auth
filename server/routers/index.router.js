import { Router } from 'express';
const indexRouter = Router();
import userController from "../controllers/user.controller.js";
import { body } from 'express-validator';
import {authMiddleware} from "../middlewares/auth.middleware.js";

indexRouter.post(
    '/registration',
    [
        body('email').isEmail(),
        body('password').isString().isLength({ min: 5, max: 12 }),
    ],
    userController.registration
);

indexRouter.post('/login',
    [
        body('email').isEmail(),
        body('password').isString().isLength({ min: 5, max: 12 }),
    ],
    userController.login
);


indexRouter.post('/logout', userController.logout);

indexRouter.get('/activate/:link', userController.activate);

indexRouter.get('/refresh', userController.refresh);

indexRouter.get('/users', authMiddleware, userController.getAll);

export default indexRouter;
