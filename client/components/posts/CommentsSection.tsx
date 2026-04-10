"use client";

import { useState } from "react";
import { useComments, useAddComment } from "@/hooks/posts.hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, CornerDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Comment } from "@/types/posts.types";

interface CommentsSectionProps {
    postId: string;
}

const CommentItem = ({
    comment,
    depth = 0,
    postId,
    onReply
}: {
    comment: Comment;
    depth?: number;
    postId: string;
    onReply: (parentId: string) => void;
}) => {
    // Defensive check
    if (!comment ||
        !comment.id ||
        typeof comment.content !== 'string' ||
        typeof comment.createdAt !== 'string') {
        return null;
    }
    const [showReplies, setShowReplies] = useState(true);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const MAX_DEPTH = 2; // Maximum nesting level before flattening
    const isFlattened = depth >= MAX_DEPTH;

    const content = (
        <div className={cn("flex gap-3", depth > 0 && "mt-3")}>
            <div className="flex flex-col items-center">
                <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {comment.isAnonymous || !comment.author
                            ? "?"
                            : comment.author.email?.[0]?.toUpperCase() || "U"
                        }
                    </AvatarFallback>
                </Avatar>
                {hasReplies && showReplies && !isFlattened && (
                    <div className="w-px flex-1 bg-border/50 mt-2" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-background/50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">
                            {comment.isAnonymous || !comment.author
                                ? "Anonymous"
                                : comment.author.email?.split("@")[0] || "Unknown"
                            }
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) : "Just now"} ago
                        </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        {comment.content || "[Empty comment]"}
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-1 ml-2">
                    {comment.id && typeof onReply === 'function' && (
                        <button
                            onClick={() => onReply(comment.id)}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Reply
                        </button>
                    )}
                    {hasReplies && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showReplies ? "Hide replies" : `Show ${comment.replies?.length || 0} replies`}
                        </button>
                    )}
                </div>

                {/* Nested Replies */}
                {hasReplies && showReplies && !isFlattened && (
                    <div className={cn(
                        "mt-3",
                        "pl-4 border-l-2 border-border/30"
                    )}>
                        {comment.replies?.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                postId={postId}
                                onReply={onReply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (isFlattened && hasReplies && showReplies) {
        return (
            <>
                {content}
                {comment.replies?.map((reply) => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        depth={depth}
                        postId={postId}
                        onReply={onReply}
                    />
                ))}
            </>
        );
    }

    return content;
};

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const comments = useComments(postId);

    const addCommentMutation = useAddComment();
    const isLoading = comments.isLoading;

    // Flatten all pages of comments
    const commentList: Comment[] = comments.data?.pages.flatMap(page => page.items || []) || [];

    const handleSubmit = () => {
        if (!newComment.trim()) return;

        addCommentMutation.mutate({
            postId,
            content: newComment,
            parentId: replyTo || undefined,
        }, {
            onSuccess: () => {
                setNewComment("");
                setReplyTo(null);
            }
        });
    };

    const handleReply = (parentId: string) => {
        setReplyTo(parentId);
        // Focus the textarea
        document.getElementById(`comment-input-${postId}`)?.focus();
    };

    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-muted rounded" />
                            <div className="h-8 w-full bg-muted rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Comment Input */}
            <div className="flex gap-3">
                <div className="flex-1">
                    {replyTo && (
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                            <CornerDownRight className="h-3 w-3" />
                            <span>Replying to comment</span>
                            <button
                                onClick={() => setReplyTo(null)}
                                className="text-primary hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <Textarea
                            id={`comment-input-${postId}`}
                            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[80px] pr-12 resize-none rounded-2xl bg-background/50 border-border/30"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || addCommentMutation.isPending}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {commentList.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    commentList.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            onReply={handleReply}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
