"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { RefreshCwIcon } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useEffect, useState } from "react"

type OTPFormData = {
    otp: string
}

type OTPInputProps = {
    onSubmit: (data: string) => void
    verifyRegisterOtpMutation: any
    handleResendOtp: () => void
}

export function OTPInput({
    onSubmit,
    verifyRegisterOtpMutation,
    handleResendOtp,
}: OTPInputProps) {

    const [countdown, setCountdown] = useState(0)

    const form = useForm<OTPFormData>({
        defaultValues: {
            otp: "",
        },
    })

    const handleSubmit = (data: OTPFormData) => {
        onSubmit(data.otp)
    }

    const handleResend = () => {
        if (countdown > 0) return

        handleResendOtp()
        setCountdown(60) // 60 second cooldown
    }

    // Countdown timer
    useEffect(() => {
        if (countdown === 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Field className="space-y-4">

                <div className="flex justify-center">
                    <FieldLabel>Verification Code</FieldLabel>
                </div>

                <Controller
                    name="otp"
                    control={form.control}
                    render={({ field }) => (
                        <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            <InputOTPGroup className="mx-auto">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <InputOTPSlot key={i} index={i} className="h-10 w-10 text-xl" />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={verifyRegisterOtpMutation.isPending}
                >
                    {verifyRegisterOtpMutation.isPending ? "Verifying..." : "Submit"}
                </Button>

                <Button
                    type="button"
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="w-full bg-muted text-primary"
                >
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend Code"}
                </Button>

            </Field>
        </form>
    )
}
