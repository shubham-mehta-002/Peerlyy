'use client'

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm, OTPInput, FormHeader } from "../components";
import { useState } from "react";
import { signupFormSchema } from "../validators/signup";
import { z } from "zod";
import { useSendRegisterOtpMutation, useVerifyRegisterOtpMutation } from "@/hooks/auth.hooks"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [formStep, setFormStep] = useState(2);
    const [countdown, setCountdown] = useState(0)

    const [signupData, setSignupData] = useState({
        email: "",
        password: ""
    })

    const sendRegisterOtpMutation = useSendRegisterOtpMutation();
    const verifyRegisterOtpMutation = useVerifyRegisterOtpMutation();
    const router = useRouter();

    const verifyStepOneFormDetails = () => {
        if (!signupData?.email || !signupData?.password) {
            toast.error("Please fill all the fields")
            setFormStep(1)
            return false;
        }

        return true;
    }

    const handleSendOtp = (data: z.infer<typeof signupFormSchema>) => {
        setSignupData(data)
        sendRegisterOtpMutation.mutate({ email: data.email }, {
            onSuccess: (data: any) => {
                toast.success(data?.message || "OTP Sent successfully!!")
                setCountdown(60)
                setFormStep(2)
            }
        })
    }

    const handleResendOtp = () => {
        if (!verifyStepOneFormDetails()) return;

        sendRegisterOtpMutation.mutate(
            { email: signupData.email },
            {
                onSuccess: (data: any) => {
                    toast.success(data?.message || "OTP Sent successfully!!");
                    setCountdown(60)
                },
            }
        );
    };


    const handleVerifyOtp = (otp: string) => {
        if (!verifyStepOneFormDetails()) return;

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
                        <OTPInput setCountdown={setCountdown} countdown={countdown} onSubmit={handleVerifyOtp} verifyRegisterOtpMutation={verifyRegisterOtpMutation} handleResendOtp={handleResendOtp} />}
                </CardContent>
            </Card>
        </div>
    )
}