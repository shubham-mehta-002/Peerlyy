import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: any[] = [];

    // 1. Handle Trusted AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors || [];
    }

    // 2. Handle Zod Validation Errors
    else if (err instanceof ZodError) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = "Validation Error";
        errors = err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }

    // 3. Handle Prisma Database Errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (err.code === 'P2002') {
            statusCode = HTTP_STATUS.CONFLICT;
            message = 'Duplicate field value entered';
            const target = (err.meta?.target as string[]) || [];
            if (target.length > 0) {
                errors = [{ field: target.join(', '), message: `Duplicate value for ${target.join(', ')}` }];
            }
        }
        // Record not found
        else if (err.code === 'P2025') {
            statusCode = HTTP_STATUS.NOT_FOUND;
            message = 'Record not found';
        }
        // Foreign key constraint failure
        else if (err.code === 'P2003') {
            statusCode = HTTP_STATUS.BAD_REQUEST;
            message = 'Foreign key constraint failed';
        }
    }

    // 4. Handle JSON Syntax Errors
    else if (err instanceof SyntaxError && 'body' in err) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid JSON payload';
    }

    // 5. Handle Generic Errors
    else {
        message = err.message || 'Something went wrong';
    }

    // Send Response using formatted ApiResponse
    ApiResponse.error(res, message, statusCode, errors);
};
