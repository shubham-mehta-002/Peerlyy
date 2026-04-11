'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { onboardingFormSchema } from "../../(auth)/validators/auth.validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCompleteProfileMutation, useOnboardingColleges } from "@/hooks/auth.hooks"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export const OnboardingForm = () => {
    const completeProfileMutation = useCompleteProfileMutation();
    const { data: collegesResponse, isLoading: isLoadingColleges } = useOnboardingColleges();
    const router = useRouter();

    const onSubmit = (data: z.infer<typeof onboardingFormSchema>) => {
        completeProfileMutation.mutate(data, {
            onSuccess: () => {
                router.push("/")
            }
        })
    }

    const form = useForm<z.infer<typeof onboardingFormSchema>>({
        resolver: zodResolver(onboardingFormSchema),
        defaultValues: {
            name: "",
            username: "",
            collegeId: ""
        },
    })
    console.log({ collegesResponse })
    const colleges = collegesResponse?.data || [];

    if (isLoadingColleges) {
        return (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Finding your college...</p>
            </div>
        )
    }

    return (
        <CardContent className="-mt-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="space-y-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Display Name</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="Enter your full name"
                                    className="h-11"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Username</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="e.g. johndoe_23"
                                    className="h-11"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="collegeId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Identify Your Campus</FieldLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full h-11">
                                        <SelectValue placeholder="Identify your campus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colleges.length > 0 ? (
                                            colleges.map((college) => (
                                                <SelectItem key={college.id} value={college.id}>
                                                    {college.name} - {college.campus}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center space-y-2">
                                                <p className="text-sm font-medium text-destructive">No campuses found</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Your college domain is not registered yet. Please contact support.
                                                </p>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {colleges.length === 0 && !isLoadingColleges && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-xs text-destructive text-center leading-relaxed">
                                We couldn't find any registered campuses for your email domain. Please reach out to <span className="font-semibold underline cursor-pointer">support@peerlyy.com</span> to add your college.
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={completeProfileMutation.isPending || (colleges.length === 0 && !isLoadingColleges)}
                        className={cn(
                            "w-full h-12 mt-2 font-bold text-base transition-all duration-300",
                            (colleges.length === 0 && !isLoadingColleges) ? "opacity-50 grayscale" : "shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                        )}
                    >
                        {completeProfileMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Setting up...</span>
                            </div>
                        ) : (
                            "Start Peerlyy"
                        )}
                    </Button>
                </FieldGroup>
            </form>
        </CardContent>

    )
}
