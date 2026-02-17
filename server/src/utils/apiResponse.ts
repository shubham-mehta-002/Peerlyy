import type { Response } from "express";

interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors?: any[];
}

export class ApiResponse {
    static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
        const response: IApiResponse<T> = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }

    static error(res: Response, message: string = 'Something went wrong', statusCode: number = 500, errors: any[] = []) {
        const response: IApiResponse<null> = {
            success: false,
            message,
            data: null,
            ...(errors.length > 0 && { errors }),
        };
        return res.status(statusCode).json(response);
    }
}
