import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../utils/AppError.js";

export const addComment = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const postId = params.postId as string;
    const { content, isAnonymous, parentId } = (req.validatedBody || req.body) as { content: string; isAnonymous?: boolean; parentId?: string };
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }


    const comment = await prisma.comment.create({
        data: {
            content,
            isAnonymous: isAnonymous || false,
            authorId: userId,
            postId,
            parentId: parentId || null,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            }
        }
    });

    return ApiResponse.success(res, comment, "Comment added successfully", HTTP_STATUS.CREATED);
});

export const getCommentsByPost = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const postId = params.postId as string;

    const comments = await prisma.comment.findMany({
        where: {
            postId,
            parentId: null,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            },
            replies: {
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    }) as any[];

    const sanitizedComments = comments.map(comment => ({
        ...comment,
        author: comment.isAnonymous ? null : comment.author,
        replies: comment.replies?.map((reply: any) => ({
            ...reply,
            author: reply.isAnonymous ? null : reply.author
        })) || []
    }));


    return ApiResponse.success(res, sanitizedComments, "Comments fetched successfully", HTTP_STATUS.OK);
});

