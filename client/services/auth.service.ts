import { ApiResponse } from "@/types/common.types";
import { AuthResponse, LoginRequest, RegisterInitRequest, RegisterCompleteRequest, User, ForgotPasswordRequest, ResetPasswordRequest, VerifyOtpResponse, CompleteProfileRequest } from "@/types/auth.types";
import { axiosInstance } from "@/config/axiosInstance";

export const authService = {
    sendRegisterOtp: async (data: RegisterInitRequest) => {
        const response = await axiosInstance.post<ApiResponse<null>>("/auth/register/init", data);
        return response.data;
    },
    verifyRegisterOtp: async (data: RegisterCompleteRequest) => {
        const response = await axiosInstance.post<ApiResponse<VerifyOtpResponse>>("/auth/register/complete", data);
        return response.data;
    },
    login: async (data: LoginRequest) => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>("/auth/login", data);
        return response.data;
    },
    me: async () => {
        const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
        return response.data;
    },
    getOnboardingColleges: async () => {
        const response = await axiosInstance.get<ApiResponse<Array<{ id: string, name: string, campus: string }>>>("/auth/colleges");
        return response.data;
    },
    completeProfile: async (data: CompleteProfileRequest) => {

        const response = await axiosInstance.post<ApiResponse<User>>("/auth/complete-profile", data);
        return response.data;
    },
    forgotPassword: async (data: ForgotPasswordRequest) => {
        const response = await axiosInstance.post<ApiResponse<null>>("/auth/forgot-password", data);
        return response.data;
    },
    resetPassword: async (data: ResetPasswordRequest) => {
        const response = await axiosInstance.post<ApiResponse<null>>("/auth/reset-password", data);
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post<ApiResponse<null>>("/auth/logout");
        return response.data;
    }
}

