"use client";

import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [searchValue, setSearchValue] = useState(initialSearch);

    // Sync state with URL if URL changes externally
    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
    }, [searchParams]);

    // Manual debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchValue) {
                params.set("search", searchValue);
            } else {
                params.delete("search");
            }
            
            // Only push if the search actually changed
            if (params.get("search") !== (searchParams.get("search") || "")) {
                router.push(`/?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, router, searchParams]);

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
                        Peerlyy
                    </h1>
                    <div className="hidden md:flex items-center relative group">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search queries, notes, or colleges..."
                            className="w-[300px] lg:w-[400px] pl-10 h-10 bg-secondary/50 border-border/20 focus:bg-background focus:border-primary/30 transition-all rounded-xl"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                        <MessageCircle className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-px bg-border/50 mx-2" />
                    <UserNav />
                </div>
            </div>
        </header>
    );
};
