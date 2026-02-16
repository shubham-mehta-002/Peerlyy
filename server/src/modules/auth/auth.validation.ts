import { z } from "zod";

export const passwordSchema = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );

export const registerInitSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const registerCompleteSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        password: passwordSchema,
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: passwordSchema,
    }),
});

export const googleLoginSchema = z.object({
    body: z.object({
        idToken: z.string(),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email()
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().trim(),
        newPassword: passwordSchema,
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        type: z.enum(["REGISTER"]),
    }),
});
