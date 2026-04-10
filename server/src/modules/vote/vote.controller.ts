import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../utils/AppError.js";

// Calculate score change based on vote operation
const calculateScoreChange = (
    operation: "add" | "remove" | "change",
    newType?: "UPVOTE" | "DOWNVOTE",
    oldType?: "UPVOTE" | "DOWNVOTE"
): number => {
    switch (operation) {
        case "add":
            return newType === "UPVOTE" ? 1 : -1;
        case "remove":
            return oldType === "UPVOTE" ? -1 : 1;
        case "change":
            // Changing from upvote to downvote: -1 - 1 = -2
            // Changing from downvote to upvote: 1 - (-1) = 2
            const oldValue = oldType === "UPVOTE" ? 1 : -1;
            const newValue = newType === "UPVOTE" ? 1 : -1;
            return newValue - oldValue;
        default:
            return 0;
    }
};

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

    let result;
    let scoreChange = 0;

    if (existingVote) {
        if (existingVote.type === type) {
            // Remove vote if same type
            scoreChange = calculateScoreChange("remove", undefined, existingVote.type);
            await prisma.$transaction([
                prisma.vote.delete({
                    where: { id: existingVote.id },
                }),
                prisma.post.update({
                    where: { id: postId },
                    data: { score: { increment: scoreChange } },
                })
            ]);
            result = { action: "removed", type: null };
        } else {
            // Update vote type
            scoreChange = calculateScoreChange("change", type, existingVote.type);
            await prisma.$transaction([
                prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { type },
                }),
                prisma.post.update({
                    where: { id: postId },
                    data: { score: { increment: scoreChange } },
                })
            ]);
            result = { action: "changed", type };
        }
    } else {
        // Create new vote
        scoreChange = calculateScoreChange("add", type);
        await prisma.$transaction([
            prisma.vote.create({
                data: {
                    type,
                    userId,
                    postId,
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: { score: { increment: scoreChange } },
            })
        ]);
        result = { action: "added", type };
    }

    // Get updated post score
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            score: true,
            _count: {
                select: { votes: true }
            }
        }
    });

    return ApiResponse.success(res, {
        ...result,
        postId,
        score: post?.score ?? 0,
        totalVotes: post?._count?.votes ?? 0,
    }, "Vote updated successfully", HTTP_STATUS.OK);
});
