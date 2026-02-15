'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { loginFormSchema } from "../validators"
import { Card } from "@/components/ui/card"
import { FormHeader, LoginForm } from "../components"



export function LoginPage({ onSubmit }: { onSubmit: (data: z.infer<typeof loginFormSchema>) => void }) {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Login to your account" />
                <LoginForm form={form} onSubmit={onSubmit} />
            </Card>
        </div>
    )
}

export default LoginPage;