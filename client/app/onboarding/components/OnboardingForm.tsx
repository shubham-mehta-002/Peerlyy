'use client'

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
        <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="Enter your full name"
                                    type="text"
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
                                    placeholder="Choose a unique username"
                                    type="text"
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
                                <FieldLabel>Select Your Campus</FieldLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
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
                                            <p className="p-2 text-xs text-muted-foreground text-center">
                                                No campuses found for your domain. Please contact admin.
                                            </p>
                                        )}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button 
                        disabled={completeProfileMutation.isPending || colleges.length === 0} 
                        className="w-full py-6 mt-4 transition-all duration-300 hover:scale-[1.01]"
                    >
                        {completeProfileMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Completing Profile...</span>
                            </div>
                        ) : (
                            "Start Exploring"
                        )}
                    </Button>
                </FieldGroup>
            </form>
        </CardContent>
    )
}
