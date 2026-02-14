import { z } from "zod"

export const loginFormSchema = z.object({
    email: z.email().trim(),
    password: z.string().trim()
})