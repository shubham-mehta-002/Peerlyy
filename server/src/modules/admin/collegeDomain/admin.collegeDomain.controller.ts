import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { AppError } from "../../../utils/AppError.js";


export const createCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domain } = req.body;

    const exists = await prisma.collegeDomain.findUnique({
        where: { domain }
    });

    if (exists) {
        throw new AppError("Domain already exists", 409);
    }

    const record = await prisma.collegeDomain.create({
        data: { domain }
    });

    res.status(201).json({
        success: true,
        data: record
    });
});

