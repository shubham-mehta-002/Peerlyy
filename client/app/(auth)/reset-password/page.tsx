'use client'
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "../components/FormHeader";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { resetPasswordSchema } from "../validators/reset-password.js";
import { z } from "zod";

const ResetPasswordPage = () => {
    const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
        console.log(data)
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Reset Password" />
                <CardContent>
                    <p className="text-center text-sm text-shadow-muted-foreground">Enter your new password and confirm it to reset your password.</p>
                </CardContent>
                <ResetPasswordForm onSubmit={onSubmit} />
            </Card>
        </div>
    )
}

export default ResetPasswordPage;