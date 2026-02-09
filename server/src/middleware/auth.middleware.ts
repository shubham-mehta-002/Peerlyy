import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { requireAuth } from "@clerk/express";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clerkId = req.auth?.userId;

        if (!clerkId) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user || user.role !== "ADMIN") {
            throw new AppError("Forbidden: Admin access required", 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};
