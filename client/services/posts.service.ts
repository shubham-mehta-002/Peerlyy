import { axiosInstance } from "@/config/axiosInstance";
import { Post, PostFilters, CreatePostRequest, PostsResponse, PostResponse, CommentsResponse } from "@/types/posts.types";
import { ApiResponse } from "@/types/common.types";

export const postsService = {
    getAllPosts: async (params: PostFilters) => {
        const response = await axiosInstance.get<PostsResponse>("/posts", { params });
        return response.data;
    },

    getPostById: async (id: string) => {
        const response = await axiosInstance.get<PostResponse>(`/posts/${id}`);
        return response.data;
    },

    createPost: async (data: CreatePostRequest) => {
        const response = await axiosInstance.post<PostResponse>("/posts", data);
        return response.data;
    },

    deletePost: async (id: string) => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/posts/${id}`);
        return response.data;
    },

    toggleVote: async (postId: string, type: "UPVOTE" | "DOWNVOTE") => {
        const response = await axiosInstance.post<ApiResponse<any>>(`/votes/${postId}`, { type });
        return response.data;
    },

    uploadMedia: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post<ApiResponse<{ url: string; mediaType: string; fileId: string }>>(
            "/posts/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    },

    getComments: async (postId: string, params: { page?: number; limit?: number }) => {
        const response = await axiosInstance.get<CommentsResponse>(`/comments/${postId}`, { params });
        return response.data;
    },

    addComment: async (postId: string, content: string, parentId?: string) => {
        const response = await axiosInstance.post<ApiResponse<any>>(`/comments/${postId}`, {
            content,
            parentId,
        });
        return response.data;
    },
};
