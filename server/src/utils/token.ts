import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRY_SECONDS,
    });
};

export const generateRefreshToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRY_SECONDS,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};
