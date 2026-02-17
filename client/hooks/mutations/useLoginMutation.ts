import { authServices } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginRequest } from "@/types/auth.types";
import axios from "axios";
import { ApiResponse } from "@/types/admin.types";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (payload: LoginRequest) => authServices.login(payload),
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