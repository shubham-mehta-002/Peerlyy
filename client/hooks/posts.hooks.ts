import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";
import { PostFilters } from "@/types/posts.types";
import { toast } from "sonner";

export const useInfinitePosts = (filters: PostFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ["posts", filters],
        queryFn: ({ pageParam = 1 }) =>
            postsService.getAllPosts({ ...filters, page: pageParam, limit: 10 }),
        getNextPageParam: (lastPage) => {
            if (!lastPage?.data?.pagination) return undefined;
            const { pagination, items } = lastPage.data;

            // Defensive: if no items returned, stop fetching
            if (!items || items.length === 0) return undefined;

            return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postsService.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create post");
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postsService.deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete post");
        },
    });
};

export const useVotePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, type }: { postId: string; type: "UPVOTE" | "DOWNVOTE" }) =>
            postsService.toggleVote(postId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to vote");
        },
    });
};

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: postsService.uploadMedia,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload media");
        },
    });
};
