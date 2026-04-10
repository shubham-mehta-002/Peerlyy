import { z } from "zod";

export const addCommentSchema = z.object({
    params: z.object({
        postId: z.string().uuid("Invalid post ID format"),
    }),
    body: z.object({
        content: z.string().min(1, "Comment content is required").max(2000, "Comment must be under 2000 characters"),
        isAnonymous: z.boolean().optional().default(false),
        parentId: z.string().uuid("Invalid parent comment ID format").optional(),
    }),
});

export const getCommentsByPostSchema = z.object({
    params: z.object({
        postId: z.string().uuid("Invalid post ID format"),
    }),
    query: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("20"),
    }),
});
