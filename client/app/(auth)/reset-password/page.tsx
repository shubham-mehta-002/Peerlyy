'use client'
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "../components/FormHeader";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { resetPasswordSchema } from "../validators/reset-password";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/hooks/auth.hooks";
import { toast } from "sonner";
import { Suspense } from "react";

const ResetPasswordContent = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()
    const resetPasswordMutation = useResetPasswordMutation();

    const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
        resetPasswordMutation.mutate({ newPassword: data.newPassword, token: token as string }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "Password reset successfully !!")
                router.push("/login")
            }
        })
    }

    return (
        <div className="mx-5 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                <FormHeader description="Reset Password" />
                <CardContent>
                    <p className="text-center text-sm text-muted-foreground">Enter your new password and confirm it to reset your password.</p>
                </CardContent>
                {!token || token.trim() === "" ?
                    <div className="flex items-center justify-center pb-6">
                        <p className="text-destructive font-medium">Token is missing or invalid</p>
                    </div> :
                    <ResetPasswordForm onSubmit={onSubmit} />}
            </Card>
        </div>
    )
}

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl p-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-4 w-32 bg-secondary animate-pulse rounded" />
                        <div className="h-10 w-full bg-secondary animate-pulse rounded" />
                    </div>
                </Card>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}

export default ResetPasswordPage;