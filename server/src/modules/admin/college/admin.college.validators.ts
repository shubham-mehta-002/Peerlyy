import { z } from "zod";

export const createCollegeSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "College name must be at least 2 characters")
            .max(150),

        campus: z
            .string()
            .min(2, "Campus name required")
            .max(150),

        domain: z
            .string()
            .min(3, "Domain is required")
            .toLowerCase()
            .regex(
                /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid domain format"
            ),
    }),
});


export const getCollegesByDomainSchema = z.object({
    query: z.object({
        email: z.email("Valid email required"),
    }),
});


export const updateCollegeSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid college id"),
    }),

    body: z.object({
        name: z.string().min(2).max(150).optional(),
        campus: z.string().min(2).max(150).optional(),
        isActive: z.boolean().optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided" }
    ),
});

export const toggleCollegeStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid college ID")
    })
});

export const deleteCollegeSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid college id"),
    }),
});