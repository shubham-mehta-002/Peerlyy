import { asyncHandler } from "../../../utils/asyncHandler.js";
import { AppError } from "../../../utils/AppError.js";
import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";

export const createCollege = asyncHandler(async (req: Request, res: Response) => {
    const { name, campus, domainId } = req.body;

    const domainExists = await prisma.collegeDomain.findUnique({
        where: { id: domainId }
    });

    if (!domainExists) {
        throw new AppError("Invalid domain", 404);
    }

    const college = await prisma.college.create({
        data: {
            name,
            campus,
            domainId
        }
    });

    res.status(201).json({
        success: true,
        data: college
    });
});


export const getCollegesByDomain = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query as { email: string };

    const domain = email.split("@")[1];

    const record = await prisma.collegeDomain.findUnique({
        where: { domain },
        include: { colleges: true }
    });

    if (!record) {
        throw new AppError("Domain not allowed", 403);
    }

    res.status(200).json({
        success: true,
        data: record.colleges
    });
});

export const updateCollege = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const college = await prisma.college.update({
        where: { id },
        data: req.body
    });

    res.status(200).json({
        success: true,
        data: college
    });
});

export const deleteCollege = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.college.delete({
        where: { id }
    });

    res.status(200).json({
        success: true,
        message: "College deleted successfully"
    });
});
