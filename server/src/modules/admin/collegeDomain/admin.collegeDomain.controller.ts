import { Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { HTTP_STATUS } from "../../../constants/index.js";

export const createCollegeDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domain } = req.body;

    const exists = await prisma.collegeDomain.findUnique({
        where: { domain }
    });

    if (exists) {
        return ApiResponse.error(res, "Domain already exists", HTTP_STATUS.CONFLICT);
    }

    const record = await prisma.collegeDomain.create({
        data: { domain }
    });

    return ApiResponse.success(res, record, "Domain created successfully", HTTP_STATUS.CREATED);
});
