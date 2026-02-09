import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validateRequest = (schema: ZodObject<ZodRawShape>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.issues
                    .map((e) => `${e.path.join(".")}: ${e.message}`)
                    .join(", ");

                next(new AppError(errorMessage, 400));
            } else {
                next(error);
            }
        }
    };
};
