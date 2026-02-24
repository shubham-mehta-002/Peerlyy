import { authServices } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginRequest } from "@/types/auth.types";
import axios from "axios";
import { ApiResponse } from "@/types/admin.types";
import { QUERY_KEYS } from "@/constants/query-keys";

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginRequest) => authServices.login(payload),
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEYS.USER.CURRENT_USER], data.data?.user);
        },
        onError: (error: unknown) => {
            if (axios.isAxiosError<ApiResponse<null>>(error)) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    })
}