import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { RegisterInitRequest } from "@/types/auth.types"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/admin.types"

export const useSendRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: (data: RegisterInitRequest) => authServices.sendRegisterOtp(data),
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}
