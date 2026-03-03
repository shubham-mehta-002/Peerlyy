"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { RefreshCwIcon } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { OTP_LENGTH } from "@/constants/variables"
import { otpFormSchema } from "../validators/auth.validator"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useVerifyRegisterOtpMutation, useSendRegisterOtpMutation } from "@/hooks/auth.hooks"

type OTPInputProps = {
    email: string
    password: string
    onSuccess: () => void
    countdown: number
    setCountdown: Dispatch<SetStateAction<number>>
}

type OTPFormSchemaType = z.infer<typeof otpFormSchema>;

export function OTPInput({
    email,
    password,
    onSuccess,
    setCountdown,
    countdown
}: OTPInputProps) {

    const verifyRegisterOtpMutation = useVerifyRegisterOtpMutation();
    const sendRegisterOtpMutation = useSendRegisterOtpMutation();

    const form = useForm<OTPFormSchemaType>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            otp: "",
        },
    })

    const handleSubmit = (data: OTPFormSchemaType) => {
        verifyRegisterOtpMutation.mutate({ email, otp: data.otp, password }, {
            onSuccess: () => {
                onSuccess();
            }
        });
    }

    const handleResend = () => {
        if (countdown > 0) return

        sendRegisterOtpMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    setCountdown(60) // 60 second cooldown
                },
            }
        );
    }

    // Countdown timer
    useEffect(() => {
        if (countdown === 0) return

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
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
                    render={({ field, fieldState }) => (
                        <>
                            <InputOTP
                                maxLength={OTP_LENGTH}
                                value={field.value}
                                onChange={field.onChange}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup className="mx-auto">
                                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                        <InputOTPSlot key={i} index={i} className="h-10 w-10 text-xl" />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            {fieldState.invalid && (
                                <FieldError className="text-center" errors={[fieldState.error]} />
                            )}
                        </>
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
