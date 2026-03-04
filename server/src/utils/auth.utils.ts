import { generateAccessToken, generateRefreshToken } from "./token.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/index.js";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import crypto from "crypto";
import { hashToken } from "./hash.js";

export const generateAndUpdateTokensInDB = async (userId: string, role: string) => {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId, role);

    const hashedRefreshToken = hashToken(refreshToken);

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken }
    })

    return { accessToken, refreshToken };
}

export const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    // TODO: Remove in production - only for development
    // console.log({ otp })
    return otp;
};

export const generateResetPasswordToken = (): string => {
    const token = crypto.randomBytes(32).toString("hex");
    // TODO: Remove in production - only for development
    // console.log({ token })
    return token;
};

export const getDomain = (email: string) => {
    const [, domain] = email.toLowerCase().trim().split("@");
    if (!domain) throw new AppError("Invalid email", HTTP_STATUS.BAD_REQUEST);
    return domain;
}

export const getNormalizedEmail = (email: string) => {
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
        throw new AppError("Too many OTP attempts. Try again in 1 minute.", HTTP_STATUS.TOO_MANY_REQUESTS);
    }

    return attempts;
};