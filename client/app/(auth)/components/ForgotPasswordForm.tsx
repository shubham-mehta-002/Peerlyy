'use client'

import { CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordSchema } from "../validators/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon } from "lucide-react";
import { useForgotPasswordMutation } from "@/hooks/auth.hooks";
import { toast } from "sonner";


export const ForgorPasswordForm = () => {
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        },
    })

    const forgotPasswordMutation = useForgotPasswordMutation();

    const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
        forgotPasswordMutation.mutate({ email: data.email })
    }

    return (
        <>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="form-rhf-demo-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-email"
                                        placeholder="Your college email ID"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full cursor-pointer">
                            {forgotPasswordMutation.isPending ? "Sending..." : "Submit"}
                        </Button>

                        <Button
                            type="submit"
                            disabled={forgotPasswordMutation.isPending}
                            className="w-full bg-muted text-primary cursor-pointer"
                        >
                            <RefreshCwIcon />
                            Resend Code
                        </Button>
                    </FieldGroup>
                    <p className="text-center text-sm text-shadow-muted-foreground mt-4">Don't have an account? <Link href="/signup" className="underline text-primary">Signup</Link></p>
                </form>
            </CardContent>
        </>
    )
}