"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { signupFormSchema } from "../validators"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
} from "@/components/ui/input-group"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"


export function SignUpForm({ onSubmit }: { onSubmit: (data: z.infer<typeof signupFormSchema>) => void }) {
    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    return (
        <>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="form-rhf-demo-email">
                                    Email
                                    <HoverCard openDelay={10} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <Button variant="link">
                                                <Badge variant="outline">i</Badge>
                                            </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="flex w-64 flex-col gap-0.5">
                                            <div className="font-semibold">
                                                Only .edu email IDs are allowed.
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
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
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="form-rhf-demo-password" className="flex">
                                    Password
                                    <HoverCard openDelay={10} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <Button variant="link">
                                                <Badge variant="outline">i</Badge>
                                            </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="flex w-64 flex-col gap-0.5">
                                            <div className="font-semibold">
                                                Your password must be at least 8 characters long. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </FieldLabel>
                                <InputGroup>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-password"
                                        placeholder="Enter your password"

                                    />
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
                                <FieldLabel htmlFor="form-rhf-demo-confirmPassword">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-confirmPassword"
                                        placeholder="Confirm your password"

                                    />
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button className="py-3"><p className="cursor-pointer text-sm text-shadow-muted-foreground">Signup</p></Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button type="button" className="py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <p className="cursor-pointer text-sm text-shadow-muted-foreground">Signup using Google</p>
                    </Button>



                </FieldGroup>
                <p className="text-center text-sm text-shadow-muted-foreground mt-4">Already have an account? <Link href="/login" className="underline text-primary">Login</Link></p>
            </form>
        </>
    )
}

