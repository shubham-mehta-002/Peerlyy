import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type SendRegisterOtpPayload = {
    email: string;
}

export const useSendRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: (data: SendRegisterOtpPayload) => authServices.sendRegisterOtp(data.email),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}
