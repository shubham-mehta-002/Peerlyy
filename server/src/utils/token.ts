import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// Convert seconds to JWT time format string (e.g., 900 -> "15m")
const secondsToJwtFormat = (seconds: number): `${number}h` | `${number}m` | `${number}s` | `${number}d` => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${remainingSeconds}s`;
};

export const generateAccessToken = (userId: string, role: string): string => {
    const options: SignOptions = {
        expiresIn: secondsToJwtFormat(env.ACCESS_TOKEN_EXPIRY_SECONDS),
    };
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, options);
};

export const generateRefreshToken = (userId: string, role: string): string => {
    const options: SignOptions = {
        expiresIn: secondsToJwtFormat(env.REFRESH_TOKEN_EXPIRY_SECONDS),
    };
    return jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid token", HTTP_STATUS.UNAUTHORIZED);
        }
        throw new AppError("Token verification failed", HTTP_STATUS.UNAUTHORIZED);
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Refresh token expired", HTTP_STATUS.UNAUTHORIZED);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid refresh token", HTTP_STATUS.UNAUTHORIZED);
        }
        throw new AppError("Token verification failed", HTTP_STATUS.UNAUTHORIZED);
    }
};
