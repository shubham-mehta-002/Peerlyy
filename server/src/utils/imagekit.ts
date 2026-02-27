import ImageKit from "imagekit";
import { env } from "../config/env.js";

export const imagekit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
});

export const uploadToImageKit = async (
    file: Buffer | string,
    fileName: string,
    folder: string = "/posts"
) => {
    try {
        const response = await imagekit.upload({
            file,
            fileName,
            folder,
            useUniqueFileName: true
        });
        return response;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw error;
    }
};

export const deleteFromImageKit = async (fileId: string) => {
    try {
        await imagekit.deleteFile(fileId);
    } catch (error) {
        console.error("ImageKit delete error:", error);
        throw error;
    }
};
