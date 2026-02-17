import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ForgotPasswordRequest } from "@/types/auth.types"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/admin.types"

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (payload: ForgotPasswordRequest) => authServices.forgotPassword(payload),
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}