'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { resetPasswordSchema } from "../validators/auth.validator"
import { z } from "zod"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { Field } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useResetPasswordMutation } from "@/hooks/auth.hooks"
import { useRouter } from "next/navigation"


export const ResetPasswordForm = ({ token }: { token: string }) => {
    const resetPasswordMutation = useResetPasswordMutation();
    const router = useRouter();
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
        resetPasswordMutation.mutate({ newPassword: data.newPassword, token }, {
            onSuccess: () => {
                router.push("/login")
            }
        })
    }

    return (
        <CardContent>
            <form id="form-rhf-reset-password" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="newPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="form-rhf-demo-email">
                                    New Password
                                </FieldLabel>
                                <InputGroup className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        id="form-rhf-demo-password"
                                        placeholder="Enter your password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="form-rhf-demo-password" className="flex">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="form-rhf-demo-confirmPassword"
                                        placeholder="Confirm your password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button type="submit" disabled={resetPasswordMutation.isPending} className="py-3 cursor-pointer"><p className="text-sm text-shadow-muted-foreground">{resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}</p></Button>

                </FieldGroup>
            </form>
        </CardContent>

    )
}