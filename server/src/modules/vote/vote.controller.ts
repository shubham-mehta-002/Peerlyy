import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../utils/AppError.js";

export const toggleVote = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const postId = params.postId as string;
    const { type } = (req.validatedBody || req.body) as { type: "UPVOTE" | "DOWNVOTE" };
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            },
        },
    });


    if (existingVote) {
        if (existingVote.type === type) {
            // Remove vote if same type
            await prisma.vote.delete({
                where: { id: existingVote.id },
            });
            return ApiResponse.success(res, null, "Vote removed", HTTP_STATUS.OK);
        } else {
            // Update vote type
            const updatedVote = await prisma.vote.update({
                where: { id: existingVote.id },
                data: { type },
            });
            return ApiResponse.success(res, updatedVote, "Vote updated", HTTP_STATUS.OK);
        }
    }

    const newVote = await prisma.vote.create({
        data: {
            type,
            userId,
            postId,
        },
    });

    return ApiResponse.success(res, newVote, "Vote added", HTTP_STATUS.CREATED);
});
