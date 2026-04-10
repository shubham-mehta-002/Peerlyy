import * as z from 'zod';

export const addCollegeSchema = z.object({
    name: z.string().trim().min(2, 'College name must be at least 2 characters'),
    campus: z.string().trim().min(2, 'Campus name must be at least 2 characters'),
    domain: z.string().trim().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
});

export type AddCollegeFormValues = z.infer<typeof addCollegeSchema>;

export const editCollegeSchema = z.object({
    name: z.string().trim().min(2, 'College name must be at least 2 characters'),
    campus: z.string().trim().min(2, 'Campus name must be at least 2 characters'),
    isActive: z.boolean(),
});

export type EditCollegeFormValues = z.infer<typeof editCollegeSchema>;

export const addDomainSchema = z.object({
    domain: z.string().trim().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
    colleges: z.array(z.object({
        name: z.string().trim().min(2, 'College name must be at least 2 characters'),
        campus: z.string().trim().min(2, 'Campus name must be at least 2 characters'),
    })).min(1, 'At least one college must be provided'),
});

export type AddDomainFormValues = z.infer<typeof addDomainSchema>;

