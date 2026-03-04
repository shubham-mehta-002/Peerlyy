import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log({ header: req.headers, cookies: req.cookies })
        const authHeader = req.headers.authorization;
        console.log({ authHeader })
        let token;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return next(new AppError("Unauthorized: No token provided", HTTP_STATUS.UNAUTHORIZED));
        }

        const decoded = verifyAccessToken(token) as JwtPayload;

        if (!decoded || !decoded.userId) {
            return next(new AppError("Unauthorized: Invalid token", HTTP_STATUS.UNAUTHORIZED));
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Forbidden: Insufficient permissions", HTTP_STATUS.FORBIDDEN));
        }
        next();
    };
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Re-implement verifyAdmin using the new req.user
    if (!req.user || req.user.role !== "ADMIN") {
        return next(new AppError("Forbidden: Admin access required", HTTP_STATUS.FORBIDDEN));
    }
    next();
};
