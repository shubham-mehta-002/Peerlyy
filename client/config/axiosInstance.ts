import axios from "axios";
import { envConfig } from "./envConfig";

export const axiosInstance = axios.create({
    baseURL: envConfig.API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

