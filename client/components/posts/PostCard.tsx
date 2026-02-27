"use client";

import { Post } from "@/types/posts.types";
import { useDeletePost, useVotePost } from "@/hooks/posts.hooks";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Globe, Building2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    const deleteMutation = useDeletePost();
    const voteMutation = useVotePost();

    const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
        voteMutation.mutate({ postId: post.id, type });
    };

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    };

    return (
        <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card/40 backdrop-blur-sm group/card rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                        <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-primary-foreground font-bold">
                            {post.author.email.toUpperCase()}
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
                <div className="relative aspect-video bg-secondary/20 group/media overflow-hidden">
                    {post.mediaType === "IMAGE" ? (
                        <img
                            src={post.mediaUrl}
                            alt="Post content"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                    ) : (
                        <video
                            src={post.mediaUrl}
                            controls
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 gap-2 flex items-center bg-secondary/10">
                <div className="flex items-center gap-1 rounded-full bg-background/50 border border-border/30 p-1 shadow-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleVote("UPVOTE")}
                        disabled={voteMutation.isPending}
                    >
                        <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-black text-foreground/90 min-w-[20px] text-center">{post._count?.votes || 0}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleVote("DOWNVOTE")}
                        disabled={voteMutation.isPending}
                    >
                        <ThumbsDown className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="ghost" size="sm" className="h-10 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors ml-1 font-bold">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="text-xs">{post._count?.comments || 0}</span>
                </Button>

                <Button variant="ghost" size="sm" className="h-10 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors font-bold">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span className="text-xs uppercase tracking-tight">Share</span>
                </Button>
            </CardFooter>
        </Card>
    );
};
