import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export const useColleges = (page = 1, limit = 10, search = "") => {
    return useQuery({
        queryKey: ["admin", "colleges", { page, limit, search }],
        queryFn: () => adminService.getAllColleges(page, limit, search),
    });
};

export const useCreateCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.createCollege,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "colleges"] });
            toast.success("College created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create college");
        },
    });
};

export const useDeleteCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteCollege,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "colleges"] });
            toast.success("College deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete college");
        },
    });
};

export const useCollegeDomains = (page = 1, limit = 10, search = "") => {
    return useQuery({
        queryKey: ["admin", "domains", { page, limit, search }],
        queryFn: () => adminService.getCollegeDomains(page, limit, search),
    });
};

export const useCreateDomain = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ domain, isActive }: { domain: string; isActive: boolean }) =>
            adminService.createCollegeDomain(domain, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "domains"] });
            toast.success("Domain created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create domain");
        },
    });
};

export const useToggleDomainStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.toggleCollegeDomainStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "domains"] });
            toast.success("Domain status toggled");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to toggle status");
        },
    });
};

export const useDeleteDomain = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteCollegeDomain,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "domains"] });
            toast.success("Domain deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete domain");
        },
    });
};
