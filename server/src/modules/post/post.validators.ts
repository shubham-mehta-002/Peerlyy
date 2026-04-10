import { z } from "zod";

export const createPostSchema = z.object({
    body: z.object({
        caption: z.string().min(1, "Caption is required"),
        mediaUrl: z.string().url("Valid media URL is required").optional(),
        mediaType: z.enum(["IMAGE", "VIDEO"]).optional(),
        mediaFileId: z.string().optional(),
        visibility: z.enum(["PUBLIC", "COLLEGE"]),
        isCollegeOnly: z.boolean(),
    }),
});

export const getPostsSchema = z.object({
    query: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("20"),
        visibility: z.enum(["PUBLIC", "COLLEGE"]).optional(),
        collegeId: z.string().optional(),
        feedType: z.enum(["global", "college"]).optional(),
        search: z.string().optional(),
        sort: z.enum(["most_upvoted", "oldest", "latest"]).optional(),
    }),
});

export const postParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid post ID format"),
    }),
});
