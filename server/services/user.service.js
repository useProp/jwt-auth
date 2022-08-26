import * as uuid from 'uuid';
import bcrypt from 'bcryptjs';
import UserModel from "../models/user.model.js";
import mailService from "./mail.service.js";
import tokenService from "./token.service.js";
import UserDto from "../dto/user.dto.js";
import {ApiError} from "../exceptions/api.exception.js";
import {INTERNAL_MESSAGE} from "../constants/httpMessages.constants.js";

class UserService {
    async registration(email, password) {
        try {
            const candidate = await UserModel.findOne({ email });
            if (candidate) {
                throw ApiError.BadRequest('User with this email already exists', ['Email']);
            }

            const hashedPassword = await bcrypt.hash(password, 5);
            const activationLink = `${process.env.API_URL}/api/activate/${uuid.v4()}`;
            const user = await UserModel.create({ email, password: hashedPassword, activationLink });

            await mailService.sendActivationEmail(email, activationLink);

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return { ...tokens, user: userDto }
        } catch (e) {
            throw ApiError.Internal(INTERNAL_MESSAGE);
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('User with this email not found');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Password is incorrect');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }


    async activate(activationLink) {
        const user = await UserModel.findOne({
            emailActivationLink: `${process.env.API_URL}/api/activate/${activationLink}`
        });
        if (!user) {
            throw ApiError.NotFound(`User with ${activationLink} does not exists`);
        }
        user.isActivated = true;
        await user.save();
    }

    async logout(refreshToken) {
       return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.Unauthorized();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async getAll() {
        return UserModel.find().select('_id email isActivated');
    }
}

export default new UserService();
