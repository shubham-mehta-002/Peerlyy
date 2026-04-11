import { ApiResponse, PaginatedResponse } from "./common.types";

export interface Author {
    id: string;
    username?: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface College {
    id: string;
    name: string;
    campus: string;
}

export interface Post {
    id: string;
    caption: string;
    mediaUrl?: string;
    mediaType?: "IMAGE" | "VIDEO";
    visibility: "PUBLIC" | "COLLEGE";
    isAnonymous: boolean;
    authorId: string;
    author: Author;
    collegeId: string;
    college?: College;
    score: number;
    userVote: "UPVOTE" | "DOWNVOTE" | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        votes: number;
        comments: number;
    };
}

export interface CreatePostRequest {
    caption: string;
    mediaUrl?: string;
    mediaType?: "IMAGE" | "VIDEO";
    visibility: "PUBLIC" | "COLLEGE";
    isCollegeOnly: boolean;
    isAnonymous: boolean;
    mediaFileId?: string;
}

export interface PostFilters {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    collegeId?: string;
    visibility?: string;
    feedType?: "global" | "college";
}

export type PostResponse = ApiResponse<Post>;
export type PostsResponse = ApiResponse<PaginatedResponse<Post>>;

export interface Comment {
    id: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        email: string;
    } | null;
    authorId: string;
    postId: string;
    parentId: string | null;
    replies?: Comment[];
}

export type CommentResponse = ApiResponse<Comment>;
export type CommentsResponse = ApiResponse<PaginatedResponse<Comment>>;
