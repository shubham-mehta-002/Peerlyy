'use client'

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm, OTPInput, FormHeader } from "../components";
import { useState } from "react";
import { signupFormSchema } from "../validators/signup";
import { z } from "zod";
import { useSendRegisterOtpMutation, useVerifyRegisterOtpMutation } from "@/hooks"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [formStep, setFormStep] = useState(1);
    const [signupData, setSignupData] = useState({
        email: "",
        password: ""
    })

    const sendRegisterOtpMutation = useSendRegisterOtpMutation();
    const verifyRegisterOtpMutation = useVerifyRegisterOtpMutation();
    const router = useRouter();

    const handleSendOtp = (data: z.infer<typeof signupFormSchema>) => {
        setSignupData(data)
        sendRegisterOtpMutation.mutate({ email: data.email }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "OTP Sent successfully!!")
                setFormStep(2)
            }
        })
    }

    const handleResendOtp = () => {
        if (!signupData?.email) {
            toast.error("Email not found. Please restart signup.");
            return;
        }

        sendRegisterOtpMutation.mutate(
            { email: signupData.email },
            {
                onSuccess: (data: any) => {
                    toast.success(data?.message || "OTP Sent successfully!!");
                },
            }
        );
    };


    const handleVerifyOtp = (otp: string) => {
        verifyRegisterOtpMutation.mutate({ email: signupData.email, otp, password: signupData.password }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "OTP Verified successfully!!")
                router.push("/login")
            }
        })
    }

    return (
        <div className="flex mx-5 flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader description={formStep === 1 ? "Create a new account" : "Verify your email address"} />
                <CardContent>
                    {formStep === 1 ? <SignUpForm onSubmit={handleSendOtp} sendRegisterOtpMutation={sendRegisterOtpMutation} />
                        :
                        <OTPInput onSubmit={handleVerifyOtp} verifyRegisterOtpMutation={verifyRegisterOtpMutation} handleResendOtp={handleResendOtp} />}
                </CardContent>
            </Card>
        </div>
    )
}