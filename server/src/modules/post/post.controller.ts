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

    let orderBy: any = { createdAt: "desc" };
    if (sort === "trending") {
        orderBy = { votes: { _count: "desc" } };
    } else if (sort === "oldest") {
        orderBy = { createdAt: "asc" };
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
                }
            },
            orderBy,
        }),
        prisma.post.count({ where }),
    ]);

    return ApiResponse.success(res, {
        items: posts,
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

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                }
            },
            votes: true,
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                        }
                    },
                    replies: true,
                }
            }
        }
    });

    if (!post) {
        throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, post, "Post fetched successfully", HTTP_STATUS.OK);
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

    // TODO: Delete media from ImageKit if fileId exists (after schema migration)
    // if (post.mediaFileId) {
    //     try {
    //         await deleteFromImageKit(post.mediaFileId);
    //     } catch (error) {
    //         console.error("Failed to delete media from ImageKit:", error);
    //     }
    // }

    await prisma.post.delete({
        where: { id },
    });

    return ApiResponse.success(res, null, "Post deleted successfully", HTTP_STATUS.OK);
});
