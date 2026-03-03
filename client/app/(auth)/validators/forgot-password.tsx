import { z } from "zod";
import { emailSchema } from "./common";

export const forgotPasswordSchema = z.object({
    email: emailSchema
});
