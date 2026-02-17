declare global {
    namespace Express {
        interface Request {
            user?: {
                userId?: string | null;
                role: string;
            };
        }
    }
}

export { };
