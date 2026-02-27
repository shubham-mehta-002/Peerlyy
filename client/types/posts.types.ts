import { ApiResponse, PaginatedResponse } from "./common.types";

export interface Author {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface Post {
    id: string;
    caption: string;
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
    visibility: "PUBLIC" | "COLLEGE";
    authorId: string;
    author: Author;
    collegeId: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        votes: number;
        comments: number;
    };
}

export interface CreatePostRequest {
    caption: string;
    mediaUrl: string;
    mediaType: string;
    visibility: string;
    isCollegeOnly: boolean;
}

export interface PostFilters {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    collegeId?: string;
    visibility?: string;
}

export type PostResponse = ApiResponse<Post>;
export type PostsResponse = ApiResponse<PaginatedResponse<Post>>;
