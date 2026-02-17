import { authServices } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/admin.types";
import { useRouter } from "next/navigation";

export const useLogoutMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authServices.logout,
        onSuccess: (data) => {
            toast.success(data.message || "Logged out successfully");
            queryClient.clear(); // Clear all query cache
            router.push("/login");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    });
};
