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
    const [refreshKey, setRefreshKey] = useState(0);

    const handlePostCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    const displayName = user ? (user.firstName || user.email?.split("@")[0]) : "";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Navigation/Filters */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    <section className="bg-card/50 backdrop-blur-sm rounded-3xl p-5 border border-border/50 shadow-sm">
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Feed Filters</h2>
                        <nav className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10 rounded-xl font-bold">
                                <TrendingUp className="mr-3 h-5 w-5" />
                                Trending
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl font-semibold">
                                <Clock className="mr-3 h-5 w-5" />
                                Latest
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl font-semibold">
                                <Filter className="mr-3 h-5 w-5" />
                                My College
                            </Button>
                        </nav>
                    </section>
                </aside>

                {/* Main Feed Area */}
                <div className="lg:col-span-6 space-y-6">
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
                        <CreatePostDialog onPostCreated={handlePostCreated} />
                    </div>

                    <div key={refreshKey}>
                        <PostList />
                    </div>
                </div>

                {/* Right Sidebar - Suggestions / Trends */}
                <aside className="hidden xl:block xl:col-span-3 space-y-6">
                    <section className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 relative z-10">Active Colleges</h2>

                        <div className="space-y-4 relative z-10">
                            {[
                                { name: "Stanford University", count: "1.2k active" },
                                { name: "MIT", count: "850 active" },
                                { name: "Harvard", count: "2.1k active" }
                            ].map((college) => (
                                <div key={college.name} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors">{college.name}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground">{college.count}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0 flex items-center justify-center bg-primary/10 opacity-0 group-hover:opacity-100 transition-all text-primary">+</Button>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>

            </main>
        </div>
    );
}