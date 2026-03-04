import type { Response } from "express";
import { IApiResponse } from "../types/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js"

export class ApiResponse {
    static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = HTTP_STATUS.OK) {
        const response: IApiResponse<T> = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }

    static error(res: Response, message: string = 'Something went wrong', statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors: any[] = []) {
        const response: IApiResponse<null> = {
            success: false,
            message,
            data: null,
            ...(errors.length > 0 && { errors }),
        };
        return res.status(statusCode).json(response);
    }
}
