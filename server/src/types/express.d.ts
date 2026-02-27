declare global {
    namespace Express {
        interface Request {
            user?: {
                userId?: string | null;
                role: string;
            };
            file?: Express.Multer.File;
            files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
        }

    }
}

export { };
