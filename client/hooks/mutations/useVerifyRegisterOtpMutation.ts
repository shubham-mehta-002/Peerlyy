import { authServices } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type VerifyRegisterOtpPayload = {
    email: string;
    otp: string;
    password: string;
};

export const useVerifyRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: (data: VerifyRegisterOtpPayload) =>
            authServices.verifyRegisterOtp(
                data.email,
                data.otp,
                data.password
            ),
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        },
    });
};
