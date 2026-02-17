import { asyncHandler } from "../../../utils/asyncHandler.js";
import { AppError } from "../../../utils/AppError.js";
import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { HTTP_STATUS } from '../../../constants/index.js';

export const createCollege = asyncHandler(async (req: Request, res: Response) => {
    const { name, campus, domain } = req.body;

    // Find or create the domain
    let collegeDomain = await prisma.collegeDomain.findUnique({
        where: { domain }
    });

    if (!collegeDomain) {
        collegeDomain = await prisma.collegeDomain.create({
            data: { domain, isActive: true }
        });
    }

    const college = await prisma.college.create({
        data: {
            name,
            campus,
            domainId: collegeDomain.id
        },
        include: {
            domain: true
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

export const getAllColleges = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { campus: { contains: search, mode: 'insensitive' } },
            { domain: { domain: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const [colleges, total] = await Promise.all([
        prisma.college.findMany({
            where,
            skip,
            take: limit,
            include: {
                domain: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.college.count({ where })
    ]);

    return ApiResponse.success(res, {
        items: colleges,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "Colleges fetched successfully", HTTP_STATUS.OK);
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
