"use client";

import { Post } from "@/types/posts.types";
import { useDeletePost, useVotePost } from "@/hooks/posts.hooks";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreVertical, Globe, Building2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Might not exist natively, so we'll just add sr-only classes directly on title instead
import { useState } from "react";
import { SharePostDialog } from "./SharePostDialog";
import { CommentsSection } from "./CommentsSection";

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    const deleteMutation = useDeletePost();
    const voteMutation = useVotePost();
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
        voteMutation.mutate({ postId: post.id, type });
    };

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    };

    const isUpvoted = post.userVote === "UPVOTE";
    const isDownvoted = post.userVote === "DOWNVOTE";

    return (
        <>
            <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card/40 backdrop-blur-sm group/card rounded-[2rem]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-primary-foreground font-bold">
                                {post.author.email[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-foreground/90 tracking-tight">
                                    {post.author.email.split("@")[0]}
                                </span>
                                {post.visibility === "COLLEGE" ? (
                                    <Badge variant="secondary" className="px-1.5 h-4.5 text-[10px] bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider">
                                        <Building2 className="h-2.5 w-2.5 mr-1" />
                                        College
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="px-1.5 h-4.5 text-[10px] bg-secondary text-muted-foreground border-border/50 font-bold uppercase tracking-wider">
                                        <Globe className="h-2.5 w-2.5 mr-1" />
                                        Public
                                    </Badge>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium">
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border/40">
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="text-destructive focus:text-destructive bg-destructive/0 focus:bg-destructive/10 cursor-pointer font-semibold"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deleteMutation.isPending ? "Deleting..." : "Delete Post"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="px-5 pb-4">
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            {post.caption}
                        </p>
                    </div>
                    {post.mediaUrl && (
                        post.mediaType === "IMAGE" ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative aspect-video bg-secondary/20 group/media overflow-hidden cursor-pointer">
                                        <img
                                            src={post.mediaUrl}
                                            alt="Post content"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-md border-border/40 p-1 w-full flex items-center justify-center">
                                    <VisuallyHidden>
                                        <DialogTitle>Expanded Post Image</DialogTitle>
                                        <DialogDescription>
                                            An expanded view of the selected post image.
                                        </DialogDescription>
                                    </VisuallyHidden>
                                    <img
                                        src={post.mediaUrl}
                                        alt="Expanded post content"
                                        className="max-h-[85vh] w-auto max-w-full object-contain rounded-md"
                                    />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <div className="relative aspect-video bg-secondary/20 group/media overflow-hidden">
                                <video
                                    src={post.mediaUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )
                    )}
                </CardContent>
                <CardFooter className="p-3 gap-2 flex items-center bg-secondary/10">
                    <div className="flex items-center gap-1 rounded-full bg-background/50 border border-border/30 p-1 shadow-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 w-8 rounded-full transition-colors",
                                isUpvoted
                                    ? "text-orange-500 bg-orange-500/10 hover:text-orange-600 hover:bg-orange-500/20"
                                    : "text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10"
                            )}
                            onClick={() => handleVote("UPVOTE")}
                            disabled={voteMutation.isPending}
                        >
                            <ArrowBigUp className="h-5 w-5" />
                        </Button>
                        <span className={cn(
                            "text-sm font-bold min-w-[24px] text-center",
                            isUpvoted ? "text-orange-500" : isDownvoted ? "text-indigo-500" : "text-foreground/90"
                        )}>
                            {post.score || 0}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 w-8 rounded-full transition-colors",
                                isDownvoted
                                    ? "text-indigo-500 bg-indigo-500/10 hover:text-indigo-600 hover:bg-indigo-500/20"
                                    : "text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"
                            )}
                            onClick={() => handleVote("DOWNVOTE")}
                            disabled={voteMutation.isPending}
                        >
                            <ArrowBigDown className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors ml-1 font-bold"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="text-xs">{post._count?.comments || 0}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors font-bold"
                        onClick={() => setShowShare(true)}
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        <span className="text-xs uppercase tracking-tight">Share</span>
                    </Button>
                </CardFooter>

                {/* Comments Section */}
                {showComments && (
                    <div className="border-t border-border/30 bg-secondary/5">
                        <CommentsSection postId={post.id} />
                    </div>
                )}
            </Card>

            {/* Share Dialog */}
            <SharePostDialog
                postId={post.id}
                open={showShare}
                onOpenChange={setShowShare}
            />
        </>
    );
};
