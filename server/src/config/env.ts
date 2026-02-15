import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    DATABASE_URL: string;
    APP_URL: string;
    CORS_ORIGIN: string[];
    PORT: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    REDIS_URL: string;
    OTP_EXPIRY_SECONDS: number;
    OTP_RATE_LIMIT_WINDOW_SECONDS: number;
    OTP_ATTEMPT_LIMIT: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};

const getEnvArray = (key: string, defaultValue?: string): string[] => {
    const value = getEnvVar(key, defaultValue);
    return value.split(",").map(v => v.trim());
};

export const env: EnvConfig = {
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    PORT: parseInt(getEnvVar("PORT", "3000"), 10),
    CORS_ORIGIN: getEnvArray("CORS_ORIGIN", "*"),
    APP_URL: getEnvVar("APP_URL", "http://localhost:3000"),

    // Auth
    JWT_ACCESS_SECRET: getEnvVar("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),
    GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),

    // Email
    SMTP_HOST: getEnvVar("SMTP_HOST"),
    SMTP_PORT: parseInt(getEnvVar("SMTP_PORT", "587"), 10),
    SMTP_USER: getEnvVar("SMTP_USER"),
    SMTP_PASS: getEnvVar("SMTP_PASS"),

    // Redis
    REDIS_URL: getEnvVar("REDIS_URL"),
    OTP_ATTEMPT_LIMIT: parseInt(getEnvVar("OTP_ATTEMPT_LIMIT", "5"), 10),
    OTP_EXPIRY_SECONDS: parseInt(getEnvVar("OTP_EXPIRY_SECONDS", "600"), 10),
    OTP_RATE_LIMIT_WINDOW_SECONDS: parseInt(getEnvVar("OTP_RATE_LIMIT_WINDOW_SECONDS", "60"), 10)
};
