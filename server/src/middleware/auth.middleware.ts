import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new AppError("Unauthorized: No token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token) as JwtPayload;

        if (!decoded || !decoded.userId) {
            throw new AppError("Unauthorized: Invalid token", 401);
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        throw new AppError("Unauthorized", 401);
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError("Forbidden: Insufficient permissions", 403);
        }
        next();
    };
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Re-implement verifyAdmin using the new req.user
    if (!req.user || req.user.role !== "ADMIN") {
        return next(new AppError("Forbidden: Admin access required", 403));
    }
    next();
};

export const protect = authenticate; // Alias for backward compatibility if needed, or just use authenticate
