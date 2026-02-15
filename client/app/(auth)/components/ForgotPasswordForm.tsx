'use client'

import { CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordSchema } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon } from "lucide-react";

export const ForgorPasswordForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof forgotPasswordSchema>) => void }) => {
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        },
    })


    return (
        <>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel htmlFor="form-rhf-demo-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-email"
                                        placeholder="Your college email ID"
                                    />
                                </Field>
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
                    </FieldGroup>
                    <p className="text-center text-sm text-shadow-muted-foreground mt-4">Don't have an account? <Link href="/signup" className="underline text-primary">Signup</Link></p>
                </form>
            </CardContent>
        </>
    )
}