import axios from "axios";
import { envConfig } from "./envConfig";
import { toast } from "sonner";

export const axiosInstance = axios.create({
    baseURL: envConfig.API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${envConfig.API_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed — token is expired, force user back to login
                toast.error("Session expired. Please login again.");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

