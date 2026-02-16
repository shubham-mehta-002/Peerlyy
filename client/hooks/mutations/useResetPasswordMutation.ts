import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type ResetPasswordPayload = {
    token: string;
    password: string;
}


export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => authServices.resetPassword(payload.token, payload.password),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}