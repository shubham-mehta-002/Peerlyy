import { authServices } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"

type ResetPasswordPayload = {
    token: string;
    password: string;
}


export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => authServices.resetPassword(payload.token, payload.password)
    })
}