import * as z from "zod"
import { passwordSchema } from "./common"


export const signupFormSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})