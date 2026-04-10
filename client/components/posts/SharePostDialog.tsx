"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SharePostDialogProps {
    postId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SharePostDialog = ({ postId, open, onOpenChange }: SharePostDialogProps) => {
    const [copied, setCopied] = useState(false);
    
    // Generate the shareable link
    const shareUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/post/${postId}`
        : `/post/${postId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link. Please copy manually.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-border/40">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" />
                        Share Post
                    </DialogTitle>
                    <DialogDescription>
                        Anyone with this link can view this post.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center gap-2 mt-4">
                    <Input
                        readOnly
                        value={shareUrl}
                        className="flex-1 bg-secondary/30 border-border/30 font-mono text-sm"
                        onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                        size="icon"
                        onClick={handleCopy}
                        className={copied ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
