'use client'
import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm, OTPInput, FormHeader } from "../components";
import { useState } from "react";
import { signupFormSchema } from "../validators/signup.js";
import { z } from "zod";

export default function SignUpPage() {
    const [formStep, setFormStep] = useState(1);
    const [signupData, setSignupData] = useState({
        email: "",
        password: ""
    })

    const handleSendOtp = (data: z.infer<typeof signupFormSchema>) => {
        console.log(data)
        setSignupData(data)
        setFormStep(2)
    }

    const handleVerifyOtp = (otp: string) => {
        console.log(otp);
        console.log({ signupData })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description={formStep === 1 ? "Create a new account" : "Verify your email address"} />
                <CardContent>
                    {formStep === 1 ? <SignUpForm onSubmit={handleSendOtp} /> : <OTPInput onSubmit={handleVerifyOtp} />}
                </CardContent>
            </Card>
        </div>
    )
}