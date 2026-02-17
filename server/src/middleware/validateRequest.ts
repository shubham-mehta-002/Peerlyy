import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const validateRequest = (schema: ZodObject<ZodRawShape>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req);
            if (!result.success) {
                throw result.error;
            }
            next();
        } catch (error) {
            console.log({ error })
            if (error instanceof ZodError) {
                const errorMessage = error.issues
                    .map((e) => `${e.path.join(".")}: ${e.message}`)
                    .join(", ");

                next(new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST));
            } else {
                next(error);
            }
        }
    };
};
