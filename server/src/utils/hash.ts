import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};


export const hashToken = (token: string) => {
    return (
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
    )
}

