"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogoutMutation } from "@/hooks/auth.hooks";
import { LogOut, User as UserIcon, Settings, Info } from "lucide-react";
import { useState } from "react";
import { ProfileDialog } from "../profile/ProfileDialog";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const UserNav = () => {
    const { data: userResponse, isLoading, isFetching } = useCurrentUser();
    console.log({ userResponse })
    const logoutMutation = useLogoutMutation();
    const user = userResponse?.data;
    console.log({ user })
    const [profileOpen, setProfileOpen] = useState(false);


    // Show skeleton while loading (initial or after invalidation)
    const isActuallyLoading = isLoading || (isFetching && !user);

    if (isActuallyLoading) {
        return (
            <div className="flex items-center gap-2 px-2 h-10 w-[120px] bg-secondary/10 rounded-full border border-border/20">
                <Skeleton className="h-8 w-8 rounded-full bg-secondary/30" />
                <Skeleton className="h-4 w-16 bg-secondary/30 rounded-md" />
            </div>
        );
    }

    if (!user) {
        return (
            <Button variant="ghost" className="flex items-center gap-2 px-4 hover:bg-primary/10 rounded-full font-bold text-sm text-muted-foreground transition-all hover:text-primary border border-transparent hover:border-primary/20" asChild>
                <Link href="/login">
                    <UserIcon className="h-4 w-4 mr-1" />
                    Login
                </Link>
            </Button>
        );
    }

    // if (isFetching) {
    //     return (
    //         <div className="flex items-center gap-2 px-2 h-10 w-[120px] bg-secondary/10 rounded-full border border-border/20">
    //             <Skeleton className="h-8 w-8 rounded-full bg-secondary/30" />
    //             <Skeleton className="h-4 w-16 bg-secondary/30 rounded-md" />
    //         </div>
    //     );
    // }

    // if (!user) {
    //     return (
    //         <Button variant="ghost" className="flex items-center gap-2 px-4 hover:bg-primary/10 rounded-full font-bold text-sm text-muted-foreground transition-all hover:text-primary border border-transparent hover:border-primary/20" asChild>
    //             <Link href="/login">
    //                 <UserIcon className="h-4 w-4 mr-1" />
    //                 Login
    //             </Link>
    //         </Button>
    //     );
    // }

    const initials = user.firstName
        ? user.firstName[0].toUpperCase()
        : (user.email ? user.email.toUpperCase() : "U");
    const displayName = user.firstName || user.email?.split("@")[0] || "User";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-primary/10 rounded-full pr-4 relative transition-all active:scale-95 group border border-transparent hover:border-primary/20">
                        <Avatar className="h-8 w-8 border border-border/50 shadow-sm group-hover:border-primary/30 transition-colors">
                            <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-black text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors">{displayName}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-border/40 shadow-2xl rounded-2xl" align="end" sideOffset={8}>
                    <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-black leading-none text-foreground">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate font-medium">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/40" />
                    <div className="p-1">
                        <DropdownMenuItem
                            onClick={() => setProfileOpen(true)}
                            className="p-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all rounded-xl font-bold text-xs uppercase tracking-widest border border-transparent focus:border-primary/20"
                        >
                            <UserIcon className="mr-3 h-4 w-4" />
                            <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setProfileOpen(true)}
                            className="p-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all rounded-xl font-bold text-xs uppercase tracking-widest border border-transparent focus:border-primary/20"
                        >
                            <Info className="mr-3 h-4 w-4" />
                            <span>Basic Details</span>
                        </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-border/40" />
                    <div className="p-1">
                        <DropdownMenuItem
                            className="p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-all rounded-xl font-black text-xs uppercase tracking-widest border border-transparent focus:border-destructive/20"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={user} />
        </>
    );
};
