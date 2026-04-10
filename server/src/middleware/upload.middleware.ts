import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return next(new AppError("File upload failed", HTTP_STATUS.BAD_REQUEST));
        }
        next();
    });
};
