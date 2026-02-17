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


export const getCollegeDomainsSchema = z.object({
    query: z.object({
        page: z.string().optional().refine(val => !val || !isNaN(Number(val)), "Page must be a number"),
        limit: z.string().optional().refine(val => !val || !isNaN(Number(val)), "Limit must be a number"),
        search: z.string().optional()
    })
});

export const toggleCollegeDomainStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid domain ID")
    })
});

export const deleteCollegeDomainSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid domain ID")
    })
});
