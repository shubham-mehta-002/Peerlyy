import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    DATABASE_URL: string;
    APP_URL: string;
    CORS_ORIGIN: string[];
    PORT: number;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    CLERK_WEBHOOK_SIGNING_SECRET: string;
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
    CLERK_PUBLISHABLE_KEY: getEnvVar("CLERK_PUBLISHABLE_KEY"),
    CLERK_SECRET_KEY: getEnvVar("CLERK_SECRET_KEY"),
    CLERK_WEBHOOK_SIGNING_SECRET: getEnvVar("CLERK_WEBHOOK_SIGNING_SECRET")
};
