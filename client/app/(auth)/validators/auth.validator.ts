import { z } from "zod";
import { OTP_LENGTH } from "@/constants/variables";

export const passwordSchema = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );

export const emailSchema = z.string().trim().min(1, "Email is required").email("Invalid email address");

export const loginFormSchema = z.object({
    email: emailSchema,
    password: z.string().trim().min(1, "Password is required")
});

export const signupFormSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export const otpFormSchema = z.object({
    otp: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema
});

export const resetPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => {
    return data.newPassword === data.confirmPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


