"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { RefreshCwIcon } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

type OTPFormData = {
    otp: string
}

export function OTPInput({ onSubmit }: { onSubmit: (data: string) => void }) {

    const form = useForm<OTPFormData>({
        defaultValues: {
            otp: ""
        }
    })

    const handleSubmit = (data: OTPFormData) => {
        onSubmit(data.otp)
    }

    return (
        <Card className="mx-auto max-w-md">
            <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Field className="space-y-2">

                        <div className="flex justify-center">
                            <FieldLabel>Verification code</FieldLabel>
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
                                        <InputOTPSlot index={0} className="h-10 w-10 text-xl" />
                                        <InputOTPSlot index={1} className="h-10 w-10 text-xl" />
                                        <InputOTPSlot index={2} className="h-10 w-10 text-xl" />
                                        <InputOTPSlot index={3} className="h-10 w-10 text-xl" />
                                        <InputOTPSlot index={4} className="h-10 w-10 text-xl" />
                                        <InputOTPSlot index={5} className="h-10 w-10 text-xl" />
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Submit
                        </Button>

                        <Button
                            type="button"
                            className="w-full bg-muted text-primary"
                        >
                            <RefreshCwIcon />
                            Resend Code
                        </Button>

                    </Field>
                </form>
            </CardContent>
        </Card>
    )
}

export default OTPInput
