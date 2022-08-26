import jwt from 'jsonwebtoken';
import TokenModel from '../models/token.model.js';

class TokenService {
    #ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
    #REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, this.#ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, this.#REFRESH_SECRET, { expiresIn: '30d' });

        return { accessToken, refreshToken }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }

        return await TokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
       return TokenModel.deleteOne({ refreshToken });
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        return TokenModel.findOne({refreshToken});
    }
}

export default new TokenService();
