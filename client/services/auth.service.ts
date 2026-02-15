import { axiosInstance } from "@/config/axiosInstance";

export const authServices = {
    sendRegisterOtp: async (email: string) => {
        const response = await axiosInstance.post("/auth/register/init", { email });
        return response.data;
    },
    verifyRegisterOtp: async (email: string, otp: string, password: string) => {
        const response = await axiosInstance.post("/auth/register/complete", { email, otp, password });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await axiosInstance.post("/auth/login", { email, password });
        return response.data;
    },
    me: async () => {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await axiosInstance.post("/auth/forgot-password", { email });
        return response.data;
    },
    resetPassword: async (email: string, otp: string, password: string) => {
        const response = await axiosInstance.post("/auth/reset-password", { email, otp, password });
        return response.data;
    }
}
