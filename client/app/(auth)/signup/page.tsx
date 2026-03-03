'use client'

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm, OTPInput, FormHeader } from "../components";
import { useState } from "react";
import { signupFormSchema } from "../validators/auth.validator";
import { z } from "zod";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [formStep, setFormStep] = useState(1);
    const [countdown, setCountdown] = useState(0)

    const [signupData, setSignupData] = useState({
        email: "",
        password: ""
    })

    const router = useRouter();


    const handleSendOtpSuccess = (data: z.infer<typeof signupFormSchema>) => {
        setSignupData(data)
        setCountdown(60)
        setFormStep(2)
    }

    const handleVerifyOtpSuccess = () => {
        router.push("/login")
    }

    return (
        <div className="flex mx-5 flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description={formStep === 1 ? "Create a new account" : "Verify your email address"} />
                <CardContent>
                    {formStep === 1 ? <SignUpForm onSuccess={handleSendOtpSuccess} />
                        :
                        <OTPInput email={signupData.email} password={signupData.password} setCountdown={setCountdown} countdown={countdown} onSuccess={handleVerifyOtpSuccess} />}
                </CardContent>
            </Card>
        </div>
    )
}