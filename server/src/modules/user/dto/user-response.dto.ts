export class UserResponseDTO {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    isProfileComplete: boolean;
    collegeId: string | null;
    createdAt: Date;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role;
        this.isVerified = user.isVerified;
        this.isProfileComplete = user.isProfileComplete;
        this.collegeId = user.collegeId;
        this.createdAt = user.createdAt;
    }
}
