import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError, ZodTypeAny } from "zod";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// Extend Express Request to include validated data
declare global {
    namespace Express {
        interface Request {
            validatedBody?: any;
            validatedQuery?: any;
            validatedParams?: any;
        }
    }
}

export const validateRequest = (schema: ZodObject<ZodRawShape> | ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            if (!result.success) {
                throw result.error;
            }
            // Store validated data in custom properties (req.body is writable, req.query is not)
            const data = result.data as any;
            if (data.body) req.validatedBody = data.body;
            if (data.query) req.validatedQuery = data.query;
            if (data.params) req.validatedParams = data.params;
            next();
        } catch (error) {
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
