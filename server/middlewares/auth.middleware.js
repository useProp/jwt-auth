import {ApiError} from "../exceptions/api.exception.js";
import tokenService from "../services/token.service.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        next(ApiError.Unauthorized());
    }
}
