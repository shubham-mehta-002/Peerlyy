import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  }

  // Handle Zod Error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  }

  // Handle Prisma Known Request Error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate field value entered';

      // Try to extract the field that caused the unique constraint violation
      const target = (err.meta?.target as string[]) || [];
      if (target.length > 0) {
        message = `Duplicate value for field: ${target.join(', ')}`;
      }
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      message = `Database Error: ${err.message}`;
    }
  }

  // Handle JSON Parse Error (SyntaxError)
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  // Handle Generic Error
  else if (err instanceof Error) {
    message = err.message;
    // In production, you might want to hide the stack trace or generic error messages
    if (process.env.NODE_ENV === 'production') {
      message = 'Something went wrong';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
