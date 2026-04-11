'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormHeader } from "../(auth)/components/FormHeader"
import { OnboardingForm } from "./components/OnboardingForm"
import { useCurrentUser } from "@/hooks/auth.hooks"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const { data: userResponse, isLoading } = useCurrentUser();
    const router = useRouter();

    const user = userResponse?.data;

    useEffect(() => {
        // If user is already complete, send them home
        if (!isLoading && user?.isProfileComplete) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20" />
                    <div className="h-4 w-32 rounded bg-muted" />
                </div>
            </div>
        )
    }

    return (
        <div className="mx-5 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full sm:max-w-md">
                <FormHeader
                    description="Final Step: Complete your profile"
                    subDescription={
                        <p>
                            Join <span className="text-primary font-semibold">{user?.email.split('@')[1]}</span>'s exclusive community.
                        </p>
                    }
                />
                <OnboardingForm />
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6 px-8 max-w-sm">
                By joining, you agree to our community guidelines and campus-only policy.
            </p>
        </div>
    )

}
