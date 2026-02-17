export interface CollegeDomain {
    id: string;
    domain: string;
    isActive: boolean;
    createdAt: string;
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
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
