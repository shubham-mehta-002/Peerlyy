import { z } from "zod";

export const createCollegeDomainSchema = z.object({
    body: z.object({
        domain: z
            .string()
            .min(3, "Domain is required")
            .toLowerCase()
            .regex(
                /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid domain format (example: abc.edu)"
            ),
    }),
});

