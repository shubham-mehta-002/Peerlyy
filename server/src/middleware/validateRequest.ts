import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError, ZodTypeAny } from "zod";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// Middleware to validate request data using Zod schema

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
                next(error);
            } else {

                next(error);
            }
        }
    };
};
