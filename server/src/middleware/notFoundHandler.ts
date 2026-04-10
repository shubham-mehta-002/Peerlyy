import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
  next(error);
};
