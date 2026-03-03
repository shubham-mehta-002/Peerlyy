import * as z from 'zod';

export const addCollegeSchema = z.object({
    name: z.string().min(2, 'College name must be at least 2 characters'),
    campus: z.string().min(2, 'Campus name must be at least 2 characters'),
    domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
});

export type AddCollegeFormValues = z.infer<typeof addCollegeSchema>;

export const editCollegeSchema = z.object({
    name: z.string().min(2, 'College name must be at least 2 characters'),
    campus: z.string().min(2, 'Campus name must be at least 2 characters'),
});

export type EditCollegeFormValues = z.infer<typeof editCollegeSchema>;

export const addDomainSchema = z.object({
    domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
    isActive: z.boolean(),
});

export type AddDomainFormValues = z.infer<typeof addDomainSchema>;

