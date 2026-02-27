'use client'

import * as z from "zod"
import { loginFormSchema } from "../validators"
import { Card } from "@/components/ui/card"
import { FormHeader, LoginForm } from "../components"
import { useLoginMutation } from "@/hooks/auth.hooks";
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export function LoginPage() {
    const loginMutation = useLoginMutation();
    const router = useRouter();

    const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
        loginMutation.mutate({ email: data.email, password: data.password }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "Login successful")
                router.push("/")
            }
        })
    }

    return (
        <div className="mx-5 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Login to your account" />
                <LoginForm onSubmit={onSubmit} />
            </Card>
        </div>
    )
}

export default LoginPage;