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
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <FormHeader
                    description="Let's set up your profile to connect with your campus."
                />

                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                    <CardHeader className="space-y-1 pb-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">Final Step</CardTitle>
                        <CardDescription>
                            Complete your profile to join {user?.email.split('@')[1]}'s exclusive community.
                        </CardDescription>
                    </CardHeader>

                    <OnboardingForm />
                </Card>

                <p className="text-center text-xs text-muted-foreground px-8">
                    By joining, you agree to our community guidelines and campus-only policy.
                </p>
            </div>
        </div>
    )
}
