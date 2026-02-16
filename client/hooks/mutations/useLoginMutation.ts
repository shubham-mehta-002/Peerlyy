import { authServices } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type LoginMutationPayload = {
    email: string;
    password: string;
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (payload: LoginMutationPayload) => authServices.login(payload.email, payload.password),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    })
}