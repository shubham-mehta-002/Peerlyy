import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: authService.me,
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            // data is ApiResponse<{ user: User, accessToken: string }>
            // We want to transform it to ApiResponse<User> to match the "me" query
            const transformedData = {
                ...data,
                data: data.data.user
            };
            queryClient.setQueryData(["auth", "me"], transformedData);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.setQueryData(["auth", "me"], null);
            queryClient.clear();
            window.location.href = "/login";
        },
    });
};

export const useSendRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: authService.sendRegisterOtp,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        },
    });
};

export const useVerifyRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: authService.verifyRegisterOtp,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "OTP verification failed");
        },
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Reset link sent to your email");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        },
    });
};

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        },
    });
};
