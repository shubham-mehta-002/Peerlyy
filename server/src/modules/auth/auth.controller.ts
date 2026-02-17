import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { redis } from "../../config/redis.js";
import { sendEmail } from "../../utils/email.js";
import { comparePassword, hashPassword, hashToken } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.js";
import { env } from "../../config/env.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { AuthProvider } from "../../constants/authProvider.enum.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateAccessAndRefreshTokens = async (userId: string, role: string) => {
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (!user) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId, role);

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    })

    return { accessToken, refreshToken };
}
// Some helper functions ...
const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log({ otp })
    return otp;
};

const generateResetPasswordToken = (): string => {
    const token = crypto.randomBytes(32).toString("hex");
    console.log({ token })
    return token;
};

const getDomain = (email: string) => {
    const [, domain] = email.toLowerCase().trim().split("@");
    if (!domain) throw new AppError("Invalid email", 400);
    return domain;
}

const getNormalizedEmail = (email: string) => {
    return email.toLowerCase().trim();
}


export const checkOtpAttempts = async (email: string) => {
    const normalizedEmail = getNormalizedEmail(email);
    const key = `otp:attempts:${normalizedEmail}`;

    const attempts = await redis.incr(key);

    // If first attempt, set expiry to 1 minute
    if (attempts === 1) {
        await redis.expire(key, env.OTP_RATE_LIMIT_WINDOW_SECONDS);
    }

    if (attempts > env.OTP_ATTEMPT_LIMIT) {
        throw new AppError("Too many OTP attempts. Try again in 1 minute.", 429);
    }

    return attempts;
};


// Initiates the registration process by sending an OTP to the user's email.
export const registerInit = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        return ApiResponse.error(res, "User already exists", HTTP_STATUS.CONFLICT);
    }

    await checkOtpAttempts(email);

    // Domain Allowlist Check
    const domain = getDomain(email);
    const isWhitelisted = await prisma.collegeDomain.findUnique({
        where: { domain },
    });

    if (!isWhitelisted || !isWhitelisted.isActive) {
        throw new AppError("Email domain is not whitelisted or strictly inactive.", HTTP_STATUS.FORBIDDEN);
    }

    const otp = generateOtp();

    await redis.setEx(
        `otp:register:${email}`,
        env.OTP_EXPIRY_SECONDS,
        otp
    );

    await sendEmail(email, "Peerlyy Registration OTP", `Your OTP is ${otp}`);

    return ApiResponse.success(
        res,
        null,
        "OTP sent successfully",
        HTTP_STATUS.OK
    );
});

// Completes the registration process by verifying the OTP and creating the user.
export const registerComplete = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);
    const { otp, password } = req.body;

    const key = `otp:register:${email}`;
    const storedOtp = await redis.get(key);
    console.log({ storedOtp, otp });
    if (!storedOtp || storedOtp !== otp) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError("User already exists", HTTP_STATUS.CONFLICT);
    }

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            isVerified: true,
            provider: AuthProvider.EMAIL,
        },
    });

    await redis.del(key);
    await redis.del(`otp:attempts:${email}`);

    return ApiResponse.success(res, null, "User registered successfully", HTTP_STATUS.OK);
});


export const login = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.id)
        throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id, user.role);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY_SECONDS,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY_SECONDS,
    });

    return ApiResponse.success(res, {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        },
        accessToken
    }, "Logged in successfully", HTTP_STATUS.OK)
});

// export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
//     const { idToken } = req.body;

//     const ticket = await googleClient.verifyIdToken({
//         idToken,
//         audience: env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     if (!payload?.email || !payload.email_verified)
//         throw new AppError("Invalid Google token", 400);

//     const email = payload.email.toLowerCase().trim();
//     const googleId = payload.sub;

//     const domain = getDomain(email);

//     const isWhitelisted = await prisma.collegeDomain.findUnique({ where: { domain } });
//     if (!isWhitelisted) throw new AppError("Email domain not supported", 400);

//     let user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//         const collegeDomain = await prisma.collegeDomain.findUnique({
//             where: { domain },
//             include: { colleges: true }
//         });

//         const collegeId = collegeDomain?.colleges?.[0]?.id ?? null;

//         user = await prisma.user.create({
//             data: {
//                 email,
//                 googleId,
//                 isVerified: true,
//                 collegeId
//             }
//         });
//     } else if (!user.googleId) {
//         await prisma.user.update({
//             where: { id: user.id },
//             data: { googleId }
//         });
//     }

//     const accessToken = generateAccessToken(user.id, user.role);
//     const refreshToken = generateRefreshToken(user.id);

//     await prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken }
//     });

//     res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//         success: true,
//         accessToken,
//         user: { id: user.id, email: user.email, role: user.role }
//     });
// });

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.json({
            success: true,
            message: "If the email exists, a reset token has been sent.",
        });
    }

    const rawToken = generateResetPasswordToken();
    const hashedToken = hashToken(rawToken);
    await redis.setEx(`token:reset:${hashedToken}`, env.RESET_PASSWORD_REQUEST_TOKEN_EXPIRY_SECONDS, user.id.toString());
    await sendEmail(email, "Password Reset Token sent to email", `Visit here to reset password  --> ${env.APP_URL}/reset-password?token=${rawToken}`);

    res.json({ success: true, message: "token sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    const hashedToken = hashToken(token);
    const key = `token:reset:${hashedToken}`;
    const userId = await redis.get(key);
    if (!userId)
        throw new AppError("Invalid or expired token", HTTP_STATUS.BAD_REQUEST);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    await redis.del(key);

    return ApiResponse.success(res, null, "Password reset successful", HTTP_STATUS.OK);
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    const decodedRefreshToken = verifyRefreshToken(incomingRefreshToken);

    const user = await prisma.user.findUnique({ where: { id: decodedRefreshToken.userId } });

    if (!user)
        throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id, user.role);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY_SECONDS,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY_SECONDS,
    });

    return ApiResponse.success(res, null, "Access token refreshed successfully", HTTP_STATUS.OK);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    // If we have the user ID from the middleware, we can clear the refresh token in the DB
    if (req.user?.userId) {
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { refreshToken: null }
        });
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    return ApiResponse.success(res, null, "Logged out successfully", HTTP_STATUS.OK);
});