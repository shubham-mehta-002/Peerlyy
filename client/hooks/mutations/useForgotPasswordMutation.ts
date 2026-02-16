import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type ForgotPasswordPayload = {
    email: string;
}


export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (payload: ForgotPasswordPayload) => authServices.forgotPassword(payload.email),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}