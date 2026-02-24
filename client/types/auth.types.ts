export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

// Request Payloads
export interface RegisterInitRequest {
    email: string;
}

export interface RegisterCompleteRequest {
    email: string;
    otp: string;
    password?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface VerifyOtpResponse {
    isVerified: boolean;
    message?: string;
}
