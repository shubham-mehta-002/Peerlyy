import { asyncHandler } from "../../utils/asyncHandler.js";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany()
    return res.status(200).json({
        success: true,
        message: "All users fetched successfully",
        data: allUsers
    })
})
