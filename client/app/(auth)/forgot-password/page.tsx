'use client'

import { Card, CardContent } from "@/components/ui/card";
import { FormHeader, ForgorPasswordForm } from "../components";


const ForgotPasswordPage = () => {

    return (
        <div className="mx-5 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Forget Password" />
                <CardContent>
                    <p className="text-center text-sm text-shadow-muted-foreground">Enter your email address and we'll send you a link to reset your password.</p>
                </CardContent>
                <ForgorPasswordForm />
            </Card>
        </div>
    )
}

export default ForgotPasswordPage;