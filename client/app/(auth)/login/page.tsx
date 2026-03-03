'use client'

import * as z from "zod"
import { loginFormSchema } from "../validators/auth.validator"
import { Card } from "@/components/ui/card"
import { FormHeader, LoginForm } from "../components"


export function LoginPage() {
    return (
        <div className="mx-5 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description="Login to your account" />
                <LoginForm />
            </Card>
        </div>
    )
}

export default LoginPage;