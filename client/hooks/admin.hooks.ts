import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/admin.types";
import { queryClient } from "@/config/queryClient";

// QUERIES

export const useColleges = (page = 1, limit = 10, search = "") => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN.COLLEGES, page, limit, search],
        queryFn: () => adminService.getAllColleges(page, limit, search),
        placeholderData: (previousData) => previousData,
        staleTime: 0,
        refetchOnMount: true,
    });
};

export const useCollegeDomains = (page = 1, limit = 10, search = "") => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN.COLLEGE_DOMAINS, page, limit, search],
        queryFn: () => adminService.getCollegeDomains(page, limit, search),
        placeholderData: (previousData) => previousData,
        staleTime: 0,
        refetchOnMount: true,
    });
};



// MUTATIONS

export const useCreateCollege = () => {
    return useMutation({
        mutationFn: adminService.createCollege,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("College created successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to create college");
        },
    });
};

export const useDeleteCollege = () => {
    return useMutation({
        mutationFn: adminService.deleteCollege,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("College deleted successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to delete college");
        },
    });
};

export const useUpdateCollege = () => {
    return useMutation({
        mutationFn: (data: { id: string; name: string; campus: string; isActive: boolean }) =>
            adminService.updateCollege(data.id, { name: data.name, campus: data.campus, isActive: data.isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("College updated successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to update college");
        },
    });
};

export const useToggleCollegeStatus = () => {
    return useMutation({
        mutationFn: adminService.toggleCollegeStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("College status toggled");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to toggle status");
        },
    });
};


export const useCreateDomain = () => {
    return useMutation({
        mutationFn: ({ domain, colleges }: { domain: string; colleges: { name: string; campus: string }[] }) =>
            adminService.createCollegeDomain(domain, colleges),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGE_DOMAINS] });
            toast.success("Domain created successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to create domain");
        },
    });
};

export const useToggleDomainStatus = () => {
    return useMutation({
        mutationFn: adminService.toggleCollegeDomainStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGE_DOMAINS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("Domain status toggled");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to toggle status");
        },
    });
};

export const useDeleteDomain = () => {
    return useMutation({
        mutationFn: adminService.deleteCollegeDomain,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGE_DOMAINS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success("Domain deleted successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to delete domain");
        },
    });
};
