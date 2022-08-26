import userService from "../services/user.service.js";
import {validationResult} from "express-validator";
import {ApiError} from "../exceptions/api.exception.js";
import {BAD_REQUEST_MESSAGE} from "../constants/httpMessages.constants.js";


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(BAD_REQUEST_MESSAGE, errors.array()));
            }

            const { email, password } = req.body;

            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(BAD_REQUEST_MESSAGE, errors.array()));
            }

            const { email, password } = req.body;

            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            res.send(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.json({ message: 'Success' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params;
            await userService.activate(link);
            res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
