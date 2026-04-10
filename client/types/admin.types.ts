import { ApiResponse, PaginatedResponse } from "./common.types";

export interface CollegeDomain {
    id: string;
    domain: string;
    isActive: boolean;
    createdAt: string;
    colleges?: {
        id: string;
        name: string;
        campus: string;
        isActive: boolean;
    }[];
    _count?: {
        colleges: number;
    }
}

export interface College {
    id: string;
    name: string;
    campus: string;
    isActive: boolean;
    domainId: string;
    domain: CollegeDomain;
    createdAt: string;
    updatedAt: string;
}

export type { ApiResponse, PaginatedResponse };
