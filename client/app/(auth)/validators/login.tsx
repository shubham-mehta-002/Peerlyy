import { z } from "zod"
import { emailSchema } from "./common"

export const loginFormSchema = z.object({
    email: emailSchema,
    password: z.string().trim().min(1, "Password is required")
})