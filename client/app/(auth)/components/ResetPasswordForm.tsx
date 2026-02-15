'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { resetPasswordSchema } from "../validators"
import { z } from "zod"
import { FieldGroup } from "@/components/ui/field"
import { Field } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CardContent } from "@/components/ui/card"

export const ResetPasswordForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof resetPasswordSchema>) => void }) => {
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    })

    return (
        <CardContent>
            <form id="form-rhf-reset-password" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="newPassword"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="form-rhf-demo-email">
                                    New Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-email"
                                    placeholder="New Password"
                                />
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
                                <InputGroup>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-password"
                                        placeholder="Confirm Password"
                                    />
                                </InputGroup>
                            </Field>
                        )}
                    />

                    <Button className="py-3"><p className="cursor-pointer text-sm text-shadow-muted-foreground">Reset Password</p></Button>

                </FieldGroup>
            </form>
        </CardContent>

    )
}