import { axiosInstance } from "@/config/axiosInstance";
import { ApiResponse, College, CollegeDomain, PaginatedResponse } from "@/types/admin.types";

export const adminService = {
    // College Operations
    getAllColleges: async (page = 1, limit = 10, search = "") => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<College>>>(`/admin/college`, {
            params: { page, limit, search }
        });
        // Backend returns "colleges" but we mapped types to generic "items" or we need to handle response structure
        // Let's adjust based on actual backend response which is { colleges: [], pagination: {} }
        // We will cast/map it or better yet, let's just return the data property which contains { colleges, pagination }
        return response.data;
    },

    createCollege: async (data: { name: string; campus: string; domain: string }) => {
        const response = await axiosInstance.post<ApiResponse<College>>(`/admin/college`, data);
        return response.data;
    },

    updateCollege: async (id: string, data: { name?: string; campus?: string; isActive?: boolean }) => {
        const response = await axiosInstance.patch<ApiResponse<College>>(`/admin/college/${id}`, data);
        return response.data;
    },

    toggleCollegeStatus: async (id: string) => {
        const response = await axiosInstance.patch<ApiResponse<College>>(`/admin/college/${id}/toggle`);
        return response.data;
    },

    deleteCollege: async (id: string) => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/admin/college/${id}`);
        return response.data;
    },

    // Domain Operations
    getCollegeDomains: async (page = 1, limit = 10, search = "") => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<CollegeDomain>>>(`/admin/college-domain`, {
            params: { page, limit, search }
        });

        return response.data;
    },

    createCollegeDomain: async (domain: string, colleges: { name: string; campus: string }[]) => {
        const response = await axiosInstance.post<ApiResponse<CollegeDomain>>(`/admin/college-domain`, { domain, colleges });
        return response.data;
    },

    toggleCollegeDomainStatus: async (id: string) => {
        const response = await axiosInstance.patch<ApiResponse<CollegeDomain>>(`/admin/college-domain/${id}/toggle`);
        return response.data;
    },

    deleteCollegeDomain: async (id: string) => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/admin/college-domain/${id}`);
        return response.data;
    }
};
