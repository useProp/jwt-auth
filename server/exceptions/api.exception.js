import {BAD_REQUEST, INTERNAL, NOT_FOUND, UNAUTHORIZED} from "../constants/httpStatuses.constant.js";
import {UNAUTHORIZED_MESSAGE} from "../constants/httpMessages.constants.js";

export class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static Unauthorized() {
        return new ApiError(UNAUTHORIZED, UNAUTHORIZED_MESSAGE);
    }

    static BadRequest(message, errors = []) {
        return new ApiError(BAD_REQUEST, message, errors);
    }

    static Internal(message, errors = []) {
        return new ApiError(INTERNAL, message, errors);
    }

    static NotFound(message, errors = []) {
        return new ApiError(NOT_FOUND, message, errors);
    }
}
