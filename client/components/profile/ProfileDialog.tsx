"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth.types";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Calendar, CheckCircle2, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

interface ProfileDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({ user, open, onOpenChange }: ProfileDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                        Profile Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-secondary/20 border border-border/30">
                        <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-2xl font-black">
                            {user.email.toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                {user.firstName || user.email.split("@")[0]} {user.lastName || ""}
                            </h3>
                            <div className="flex items-center mt-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                                    {user.role}
                                </Badge>
                                {user.isVerified && (
                                    <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center p-3 rounded-xl bg-background/50 border border-border/20">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                                <Mail className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                                <p className="text-sm font-bold text-foreground/90">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 rounded-xl bg-background/50 border border-border/20">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account ID</p>
                                <p className="text-xs font-mono text-foreground/70 truncate">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 rounded-xl bg-background/50 border border-border/20">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Joined On</p>
                                <p className="text-sm font-bold text-foreground/90">
                                    {format(new Date(user.createdAt), "PPP")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
