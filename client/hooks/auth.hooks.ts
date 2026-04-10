import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: authService.me,
        staleTime: 5 * 60 * 1000, // 5 minutes — avoid hammering /auth/me on every mount
    });
};

export const useOnboardingColleges = () => {
    return useQuery({
        queryKey: ["auth", "onboarding-colleges"],
        queryFn: authService.getOnboardingColleges,
        staleTime: Infinity, // These don't change often for a user's domain
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
            toast.success(data.message || "Login successful");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
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
        onSuccess: (data) => {
            toast.success(data.message || "OTP Sent successfully!!");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        },
    });
};

export const useVerifyRegisterOtpMutation = () => {
    return useMutation({
        mutationFn: authService.verifyRegisterOtp,
        onSuccess: (data) => {
            toast.success(data.message || "OTP Verified successfully!!");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
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
        onError: (error: AxiosError<ApiResponse<null>>) => {
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
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        },
    });
};

export const useCompleteProfileMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.completeProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(["auth", "me"], data);
            toast.success("Profile completed successfully!");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            toast.error(error.response?.data?.message || "Failed to complete profile");
        },
    });
};

