import { useInfinitePosts } from "@/hooks/posts.hooks";
import { PostCard } from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

export const PostList = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    } = useInfinitePosts();

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card/20 backdrop-blur-sm p-6 rounded-[2rem] border border-border/20 space-y-4">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-64 w-full rounded-2xl" />
                        <div className="flex space-x-4">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="text-center py-20 bg-destructive/5 rounded-[2rem] border-2 border-dashed border-destructive/20">
                <p className="text-destructive font-medium">Failed to load posts. Please try again later.</p>
            </div>
        );
    }

    const posts = data?.pages.flatMap(page => page?.data?.items || []) || [];

    return (
        <div className="space-y-6 pb-20">
            {posts.length > 0 ? (
                <>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {hasNextPage && (
                        <div ref={ref} className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}

                    {!hasNextPage && !isFetchingNextPage && (
                        <div className="text-center py-10">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">You've seen everything</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-secondary/10 rounded-[2rem] border-2 border-dashed border-border/30">
                    <p className="text-muted-foreground font-medium">No posts found. Be the first to share!</p>
                </div>
            )}
        </div>
    );
};
