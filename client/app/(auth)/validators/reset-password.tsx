import { z } from "zod";
import { passwordSchema } from "./common";

export const resetPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => {
    return data.newPassword === data.confirmPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
