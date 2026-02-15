const getPublicEnv = (
    value: string | undefined,
    key: string
): string => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const envConfig = {
    API_URL: getPublicEnv(
        process.env.NEXT_PUBLIC_API_URL,
        "NEXT_PUBLIC_API_URL"
    ),
};
