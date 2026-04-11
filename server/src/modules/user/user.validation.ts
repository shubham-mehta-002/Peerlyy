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
        password: z.string().min(1, "Password is required"),
    }),
});


export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email()
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().trim(),
        newPassword: passwordSchema,
    }),
});

export const refreshAccessTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string().min(1, "Refresh token is required")
    })
});

export const completeProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        username: z.string().min(3, "Username must be at least 3 characters").max(30),
        collegeId: z.string().uuid("Invalid collegeId")
    })
});
