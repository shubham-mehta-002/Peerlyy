import { z } from "zod";

export const toggleVoteSchema = z.object({
    params: z.object({
        postId: z.string().uuid("Invalid post ID format"),
    }),
    body: z.object({
        type: z.enum(["UPVOTE", "DOWNVOTE"]),
    }),
});
