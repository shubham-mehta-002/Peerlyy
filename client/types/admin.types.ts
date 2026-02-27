import { ApiResponse, PaginatedResponse } from "./common.types";

export interface CollegeDomain {
    id: string;
    domain: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    colleges?: {
        name: string;
        campus: string;
    }[];
    _count?: {
        colleges: number;
    }
}

export interface College {
    id: string;
    name: string;
    campus: string;
    domainId: string;
    domain: CollegeDomain;
    createdAt: string;
    updatedAt: string;
}

export type { ApiResponse, PaginatedResponse };
