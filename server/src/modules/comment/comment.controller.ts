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

    const query = req.validatedQuery || req.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [topLevelComments, total] = await Promise.all([
        prisma.comment.findMany({
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
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.comment.count({ where: { postId, parentId: null } }),
    ]);

    const allReplies = await prisma.comment.findMany({
        where: {
            postId,
            parentId: { not: null },
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: "asc", // Older replies first to maintain conversation flow
        },
    });

    const commentMap = new Map();

    // Initialize map with top-level comments
    topLevelComments.forEach((comment: any) => {
        const sanitizedComment = {
            ...comment,
            author: comment.isAnonymous ? null : comment.author,
            replies: []
        };
        commentMap.set(comment.id, sanitizedComment);
    });

    // Initialize map with all replies
    allReplies.forEach((comment: any) => {
        const sanitizedComment = {
            ...comment,
            author: comment.isAnonymous ? null : comment.author,
            replies: []
        };
        commentMap.set(comment.id, sanitizedComment);
    });

    // Build the tree
    allReplies.forEach((reply: any) => {
        const replyNode = commentMap.get(reply.id);
        const parentNode = commentMap.get(reply.parentId);

        if (parentNode) {
            parentNode.replies.push(replyNode);
        }
    });

    // Form final items (only top-level comments from current page)
    const sanitizedComments = topLevelComments.map((comment: any) => commentMap.get(comment.id));

    return ApiResponse.success(res, {
        items: sanitizedComments,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }, "Comments fetched successfully", HTTP_STATUS.OK);
});

