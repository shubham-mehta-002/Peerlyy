import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { redis } from "../../config/redis.js";
import { sendEmail } from "../../utils/email.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.js";
import { env } from "../../config/env.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { AuthProvider } from "../../constants/authProvider.enum.js";
import { HTTP_STATUS } from "../../constants/index.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);


// Some helper functions ...
const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log({ otp })
    return otp;
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

    // ✅ Cleanup
    await redis.del(key);
    await redis.del(`otp:attempts:${email}`);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
        success: true,
    });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password)
        throw new AppError("Invalid credentials", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    if (!user.isVerified)
        throw new AppError("Account not verified", 403);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        success: true,
        accessToken,
        user: { id: user.id, email: user.email, role: user.role }
    });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified)
        throw new AppError("Invalid Google token", 400);

    const email = payload.email.toLowerCase().trim();
    const googleId = payload.sub;

    const domain = getDomain(email);

    const isWhitelisted = await prisma.collegeDomain.findUnique({ where: { domain } });
    if (!isWhitelisted) throw new AppError("Email domain not supported", 400);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const collegeDomain = await prisma.collegeDomain.findUnique({
            where: { domain },
            include: { colleges: true }
        });

        const collegeId = collegeDomain?.colleges?.[0]?.id ?? null;

        user = await prisma.user.create({
            data: {
                email,
                googleId,
                isVerified: true,
                collegeId
            }
        });
    } else if (!user.googleId) {
        await prisma.user.update({
            where: { id: user.id },
            data: { googleId }
        });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        success: true,
        accessToken,
        user: { id: user.id, email: user.email, role: user.role }
    });
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        const otp = generateOtp();
        await redis.setEx(`peerlyy:otp:reset:${email}`, 600, otp);
        await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    }

    res.json({ success: true, message: "If email exists, OTP sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase().trim();
    const { otp, newPassword } = req.body;

    await checkOtpAttempts(email);

    const key = `peerlyy:otp:reset:${email}`;
    const storedOtp = await redis.get(key);

    if (!storedOtp || storedOtp !== otp)
        throw new AppError("Invalid or expired OTP", 400);

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    await redis.del(key);

    res.json({ success: true, message: "Password reset successful" });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, type } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    let key =
        type === "REGISTER"
            ? `peerlyy:otp:register:${normalizedEmail}`
            : `peerlyy:otp:reset:${normalizedEmail}`;

    const storedOtp = await redis.get(key);

    if (!storedOtp || storedOtp !== otp)
        throw new AppError("Invalid or expired OTP", 400);

    await redis.del(key);

    res.json({ success: true, message: "OTP verified" });
});