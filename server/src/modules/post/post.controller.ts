import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../utils/AppError.js";
import { uploadToImageKit, deleteFromImageKit } from "../../utils/imagekit.js";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { caption, mediaUrl, mediaType, visibility, isCollegeOnly } = req.validatedBody || req.body;
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    // TODO: Add mediaFileId to schema after running migration
    const post = await prisma.post.create({
        data: {
            caption,
            mediaUrl,
            mediaType,
            visibility,
            isCollegeOnly,
            authorId: userId,
            collegeId: user?.collegeId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            },
            college: true
        }
    });

    return ApiResponse.success(res, post, "Post created successfully", HTTP_STATUS.CREATED);
});

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const query = req.validatedQuery || req.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const { search, visibility, collegeId, sort } = query;
    const userId = req.user?.userId;

    const where: any = {};
    if (search) {
        where.OR = [
            { caption: { contains: search as string, mode: "insensitive" } },
        ];
    }
    if (visibility) {
        where.visibility = visibility;
    }
    if (collegeId) {
        where.collegeId = collegeId as string;
    }

    // Sorting: latest (default), oldest, most_upvoted
    let orderBy: any = { createdAt: "desc" };
    if (sort === "most_upvoted") {
        orderBy = { score: "desc" };
    } else if (sort === "oldest") {
        orderBy = { createdAt: "asc" };
    } else if (sort === "latest") {
        orderBy = { createdAt: "desc" };
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            skip,
            take: limit,
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                    }
                },
                college: true,
                _count: {
                    select: {
                        votes: true,
                        comments: true,
                    }
                },
                // Include user's vote if logged in
                votes: userId ? {
                    where: { userId },
                    select: { type: true }
                } : false,
            },
            orderBy,
        }),
        prisma.post.count({ where }),
    ]);

    // Transform posts to include userVote field and ensure score exists
    const transformedPosts = posts.map(post => ({
        ...post,
        userVote: post.votes?.[0]?.type || null,
        votes: undefined, // Remove votes array from response
    }));

    return ApiResponse.success(res, {
        items: transformedPosts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }, "Posts fetched successfully", HTTP_STATUS.OK);
});


export const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const id = params.id as string;
    const userId = req.user?.userId;

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            },
            college: true,
            _count: {
                select: {
                    votes: true,
                    comments: true,
                }
            },
            votes: userId ? {
                where: { userId },
                select: { type: true }
            } : false,
        }
    });

    if (!post) {
        throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);
    }

    const transformedPost = {
        ...post,
        userVote: post.votes?.[0]?.type || null,
        votes: undefined,
    };

    return ApiResponse.success(res, transformedPost, "Post fetched successfully", HTTP_STATUS.OK);
});

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError("No file uploaded", HTTP_STATUS.BAD_REQUEST);
    }

    const response = await uploadToImageKit(req.file.buffer, req.file.originalname);

    return ApiResponse.success(res, {
        url: response.url,
        fileId: response.fileId,
        mediaType: response.fileType === "image" ? "IMAGE" : "VIDEO"
    }, "Media uploaded successfully", HTTP_STATUS.OK);
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedParams || req.params;
    const id = params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);
    }

    if (post.authorId !== userId) {
        throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
    }

    // Delete media from ImageKit if fileId exists
    if (post.mediaFileId) {
        try {
            await deleteFromImageKit(post.mediaFileId);
        } catch (error) {
            console.error("Failed to delete media from ImageKit:", error);
        }
    }

    // Delete related records first to avoid FK constraint errors
    await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.vote.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
    ]);

    return ApiResponse.success(res, null, "Post deleted successfully", HTTP_STATUS.OK);
});
