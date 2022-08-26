import {ApiError} from "../exceptions/api.exception.js";
import {INTERNAL} from "../constants/httpStatuses.constant.js";
import {INTERNAL_MESSAGE} from "../constants/httpMessages.constants.js";

export const errorMiddleware = (err, req, res) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res
            .status(err?.status || INTERNAL)
            .json({
                message: err.message,
                errors: err?.errors || [],
            })
    }

    res.status(INTERNAL).json({
            error: INTERNAL_MESSAGE
        })
}
