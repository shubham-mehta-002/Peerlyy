'use client'

import * as z from "zod"
import { loginFormSchema } from "../validators"
import { Card } from "@/components/ui/card"
import { FormHeader, LoginForm } from "../components"
import { useLoginMutation } from "@/hooks"
import { toast } from "sonner"


export function LoginPage() {
    const loginMutation = useLoginMutation();

    const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
        loginMutation.mutate({ email: data.email, password: data.password }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "Login successful")
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Login to your account" />
                <LoginForm onSubmit={onSubmit} />
            </Card>
        </div>
    )
}

export default LoginPage;