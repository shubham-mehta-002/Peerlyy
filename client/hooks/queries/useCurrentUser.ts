import { useQuery } from "@tanstack/react-query";
import { authServices } from "@/services/auth.service";
import { User } from "@/types/auth.types";
import { QUERY_KEYS } from "@/constants/query-keys";

export const useCurrentUser = () => {
    return useQuery<User | null>({
        queryKey: [QUERY_KEYS.USER.CURRENT_USER],
        queryFn: async () => {
            try {
                const response = await authServices.me();
                return response.data;
            } catch (error) {
                return null;
            }
        },
        retry: false, // Don't retry on 401/403
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};  
