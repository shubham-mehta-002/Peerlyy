import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { AuthProvider } from "../../constants/authProvider.enum.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { generateAndUpdateTokensInDB, generateOtp, asyncHandler, getDomain, getNormalizedEmail, checkOtpAttempts, generateResetPasswordToken, ApiResponse, AppError, sendEmail, comparePassword, hashPassword, hashToken, verifyRefreshToken } from "../../utils/index.js";
import { redis } from "../../config/redis.js";
import { toUserResponse } from "./user.mapper.js";
// Initiates the registration process by sending an OTP to the user's email.
export const registerInit = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        throw new AppError("User already exists", HTTP_STATUS.CONFLICT);
    }

    // Domain Allowlist Check
    const domain = getDomain(email);
    const isWhitelisted = await prisma.collegeDomain.findUnique({
        where: { domain, isActive: true },
    });

    if (!isWhitelisted) {
        throw new AppError("Email domain not supported", HTTP_STATUS.FORBIDDEN);
    }

    await checkOtpAttempts(email);

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

    if (!storedOtp || storedOtp !== otp) {
        throw new AppError("Invalid or expired OTP", HTTP_STATUS.BAD_REQUEST);
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

    return ApiResponse.success(res, { user }, "User registered successfully", HTTP_STATUS.CREATED);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.id)
        throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);

    const { accessToken, refreshToken } = await generateAndUpdateTokensInDB(user.id, user.role);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY_SECONDS * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY_SECONDS * 1000,
    });

    return ApiResponse.success(res, {
        user: toUserResponse(user)
    }, "Logged in successfully", HTTP_STATUS.OK)
});


export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const email = getNormalizedEmail(req.body.email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Return success to prevent email enumeration attacks
        return ApiResponse.success(res, null, "If the email exists, a reset token has been sent.", HTTP_STATUS.OK);
    }

    const rawToken = generateResetPasswordToken();
    const hashedToken = hashToken(rawToken);
    await redis.setEx(`token:reset:${hashedToken}`, env.RESET_PASSWORD_REQUEST_TOKEN_EXPIRY_SECONDS, user.id.toString());
    await sendEmail(email, "Password Reset Token sent to email", `Visit here to reset password  --> ${env.APP_URL}/reset-password?token=${rawToken}`);

    return ApiResponse.success(res, null, "Check your email for further instructions", HTTP_STATUS.OK);
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
    if (!incomingRefreshToken)
        throw new AppError("Refresh token not found", HTTP_STATUS.UNAUTHORIZED);

    const decodedRefreshToken = verifyRefreshToken(incomingRefreshToken);

    const user = await prisma.user.findUnique({ where: { id: decodedRefreshToken.userId } });

    if (!user || !user.refreshToken)
        throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);

    const hashedIncomingToken = hashToken(incomingRefreshToken);
    if (user.refreshToken !== hashedIncomingToken) {
        throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = await generateAndUpdateTokensInDB(user.id, user.role);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY_SECONDS * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY_SECONDS * 1000,
    });

    return ApiResponse.success(res, null, "Access token refreshed successfully", HTTP_STATUS.OK);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user?.userId as string }
    });

    if (!user) {
        throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, toUserResponse(user), "User profile fetched successfully", HTTP_STATUS.OK);
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

export const completeProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { name, username, collegeId } = req.body;

    if (username) {
        const existingUsername = await prisma.user.findUnique({
            where: { username }
        });
        if (existingUsername && existingUsername.id !== userId) {
            throw new AppError("Username is already taken", HTTP_STATUS.CONFLICT);
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            username,
            collegeId,
            isProfileComplete: true
        }
    });

    return ApiResponse.success(res, toUserResponse(updatedUser), "Profile completed successfully", HTTP_STATUS.OK);
});

