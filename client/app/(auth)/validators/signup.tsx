import * as z from "zod"
import { passwordSchema, emailSchema } from "./common"
import { OTP_LENGTH } from "@/constants/variables"


export const signupFormSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})


export const otpFormSchema = z.object({
    otp: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
})