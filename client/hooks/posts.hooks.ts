import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";
import { PostFilters, Comment } from "@/types/posts.types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";

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
        onError: (error: AxiosError<ApiResponse<null>>) => {
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
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to delete post");
        },
    });
};

export const useVotePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, type }: { postId: string; type: "UPVOTE" | "DOWNVOTE" }) =>
            postsService.toggleVote(postId, type),
        onSuccess: (data) => {
            // Optimistically update the UI
            queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        data: {
                            ...page.data,
                            items: page.data.items.map((post: any) => {
                                if (post.id === data.data?.postId) {
                                    return {
                                        ...post,
                                        score: data.data?.score ?? post.score,
                                        userVote: data.data?.type ?? null,
                                    };
                                }
                                return post;
                            }),
                        },
                    })),
                };
            });

            // Also invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to vote");
        },
    });
};

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: postsService.uploadMedia,
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to upload media");
        },
    });
};

export const useComments = (postId: string) => {
    return useInfiniteQuery({
        queryKey: ["comments", postId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await postsService.getComments(postId, { page: pageParam as number, limit: 20 });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.pagination) return undefined;
            const { pagination, items } = lastPage;
            if (!items || items.length === 0) return undefined;
            return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
            postsService.addComment(postId, content, parentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Comment added!");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to add comment");
        },
    });
};
