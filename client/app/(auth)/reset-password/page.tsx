'use client'
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "../components/FormHeader";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { resetPasswordSchema } from "../validators/reset-password";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/hooks/mutations/useResetPasswordMutation";
import { toast } from "sonner";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const resetPasswordMutation = useResetPasswordMutation();
    const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
        resetPasswordMutation.mutate({ password: data.newPassword, token: token as string }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "Password reset successfully !!")
            }
        })

    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Reset Password" />
                <CardContent>
                    <p className="text-center text-sm text-shadow-muted-foreground">Enter your new password and confirm it to reset your password.</p>
                </CardContent>
                {!token || token.trim() === "" ?
                    <div className="flex items-center justify-center">
                        <p className="text-red-500">Token is missing</p>
                    </div> :
                    <ResetPasswordForm onSubmit={onSubmit} />}
            </Card>
        </div>
    )
}

export default ResetPasswordPage;