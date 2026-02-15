'use client'

import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "../components";
import { forgotPasswordSchema } from "../validators/forgot-password";
import { z } from "zod";
import { ForgorPasswordForm } from "../components";

const ForgotPasswordPage = () => {
    const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
        console.log(data)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Forget Password" />
                <CardContent>
                    <p className="text-center text-sm text-shadow-muted-foreground">Enter your email address and we'll send you a link to reset your password.</p>
                </CardContent>
                <ForgorPasswordForm onSubmit={onSubmit} />
            </Card>
        </div>
    )
}

export default ForgotPasswordPage;