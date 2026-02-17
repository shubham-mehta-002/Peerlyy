import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../constants/index.js";
import { AppError } from "../../../utils/AppError.js";

export const createCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domain, isActive } = req.body;

    const exists = await prisma.collegeDomain.findUnique({
        where: { domain }
    });

    if (exists) {
        return ApiResponse.error(res, "Domain already exists", HTTP_STATUS.CONFLICT);
    }

    const record = await prisma.collegeDomain.create({
        data: {
            domain,
            isActive: isActive !== undefined ? isActive : true
        }
    });

    return ApiResponse.success(res, record, "Domain created successfully", HTTP_STATUS.CREATED);
});

export const getCollegeDomains = asyncHandler(async (req: Request, res: Response) => {
    // Pagination and search
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.domain = {
            contains: search,
            mode: 'insensitive'
        };
    }

    const [domains, total] = await Promise.all([
        prisma.collegeDomain.findMany({
            where,
            skip,
            take: limit,
            include: {
                colleges: {
                    select: {
                        name: true,
                        campus: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.collegeDomain.count({ where })
    ]);

    return ApiResponse.success(res, {
        domains,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "Domains fetched successfully", HTTP_STATUS.OK);
});

export const toggleCollegeDomainStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const domain = await prisma.collegeDomain.findUnique({
        where: { id }
    });

    if (!domain) {
        throw new AppError("Domain not found", HTTP_STATUS.NOT_FOUND);
    }

    const updatedDomain = await prisma.collegeDomain.update({
        where: { id },
        data: {
            isActive: !domain.isActive
        }
    });

    return ApiResponse.success(res, updatedDomain, `Domain ${updatedDomain.isActive ? 'activated' : 'deactivated'} successfully`, HTTP_STATUS.OK);
});

export const deleteCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // Check if colleges are associated
    const domain = await prisma.collegeDomain.findUnique({
        where: { id },
        include: { _count: { select: { colleges: true } } }
    });

    if (!domain) {
        throw new AppError("Domain not found", HTTP_STATUS.NOT_FOUND);
    }

    if (domain._count.colleges > 0) {
        throw new AppError("Cannot delete domain with associated colleges. Please remove colleges first.", HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.collegeDomain.delete({
        where: { id }
    });

    return ApiResponse.success(res, null, "Domain deleted successfully", HTTP_STATUS.OK);
});
