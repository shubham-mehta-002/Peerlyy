import * as z from "zod"


export const passwordSchema = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );


export const signupFormSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})