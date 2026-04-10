import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../constants/index.js";
import { AppError } from "../../../utils/AppError.js";

export const createCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domain, colleges } = req.validatedBody || req.body;

    const exists = await prisma.collegeDomain.findUnique({
        where: { domain }
    });

    if (exists) {
        throw new AppError("Domain already exists", HTTP_STATUS.CONFLICT);
    }

    const record = await prisma.$transaction(async (tx) => {
        const domainRecord = await tx.collegeDomain.create({
            data: {
                domain,
                isActive: true,
                colleges: {
                    create: colleges.map((c: any) => ({
                        name: c.name,
                        campus: c.campus,
                        isActive: true
                    }))
                }
            },
            include: {
                colleges: true
            }
        });
        return domainRecord;
    });

    return ApiResponse.success(res, record, "Domain and colleges created successfully", HTTP_STATUS.CREATED);
});

export const getCollegeDomains = asyncHandler(async (req: Request, res: Response) => {
    // Pagination and search
    const query = req.validatedQuery || req.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = query.search as string;

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
                        id: true,
                        name: true,
                        campus: true,
                        isActive: true
                    },
                    orderBy: {
                        name: 'asc'
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
        items: domains,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "Domains fetched successfully", HTTP_STATUS.OK);
});

export const toggleCollegeDomainStatus = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const id = params.id as string;

    const domain = await prisma.collegeDomain.findUnique({
        where: { id }
    });

    if (!domain) {
        throw new AppError("Domain not found", HTTP_STATUS.NOT_FOUND);
    }

    const newStatus = !domain.isActive;

    const updatedDomain = await prisma.$transaction(async (tx) => {
        const updated = await tx.collegeDomain.update({
            where: { id },
            data: { isActive: newStatus }
        });

        // Sync all colleges with the domain status
        await tx.college.updateMany({
            where: { domainId: id },
            data: { isActive: newStatus }
        });

        return updated;
    });

    return ApiResponse.success(res, updatedDomain, `Domain and all its colleges ${updatedDomain.isActive ? 'activated' : 'deactivated'} successfully`, HTTP_STATUS.OK);
});

export const deleteCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const id = params.id as string;

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
