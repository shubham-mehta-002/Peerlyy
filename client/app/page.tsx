"use client";

import { PostList } from "@/components/posts/PostList";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import { User, TrendingUp, Clock, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useCurrentUser } from "@/hooks/auth.hooks";

export default function StudentHomePage() {
    const { data: userResponse } = useCurrentUser();
    const user = userResponse?.data;

    const displayName = user ? (user.firstName || user.email?.split("@")[0]) : "";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Main Feed Area */}
                <div className="max-w-2xl mx-auto w-full space-y-6">
                    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-[2rem] border border-border/50 shadow-xl shadow-primary/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-foreground">Ready to share{displayName ? `, ${displayName}` : ""}?</p>
                                <p className="text-xs text-muted-foreground">Post to your college or everyone.</p>
                            </div>
                        </div>
                        <CreatePostDialog />
                    </div>

                    <PostList />
                </div>

            </main>
        </div>
    );
}