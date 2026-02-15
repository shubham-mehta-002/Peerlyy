import { asyncHandler } from "../../../utils/asyncHandler.js";
import { AppError } from "../../../utils/AppError.js";
import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { HTTP_STATUS } from '../../../constants/index.js';

export const createCollege = asyncHandler(async (req: Request, res: Response) => {
    const { name, campus, domainId } = req.body;

    const domainExists = await prisma.collegeDomain.findUnique({
        where: { id: domainId }
    });

    if (!domainExists) {
        throw new AppError("Invalid domain", HTTP_STATUS.BAD_REQUEST);
    }

    const college = await prisma.college.create({
        data: {
            name,
            campus,
            domainId
        }
    });

    return ApiResponse.success(res, college, "College created successfully", HTTP_STATUS.CREATED);
});


export const getCollegesByDomain = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query as { email: string };

    const domain = email.split("@")[1];

    const record = await prisma.collegeDomain.findUnique({
        where: { domain },
        include: { colleges: true }
    });

    if (!record) {
        throw new AppError("Domain not allowed", HTTP_STATUS.FORBIDDEN);
    }

    return ApiResponse.success(res, record.colleges, "Colleges fetched successfully", HTTP_STATUS.OK);
});

export const updateCollege = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const college = await prisma.college.update({
        where: { id },
        data: req.body
    });

    return ApiResponse.success(res, college, "College updated successfully", HTTP_STATUS.OK);
});

export const deleteCollege = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.college.delete({
        where: { id }
    });

    return ApiResponse.success(res, null, "College deleted successfully", HTTP_STATUS.OK);
});
