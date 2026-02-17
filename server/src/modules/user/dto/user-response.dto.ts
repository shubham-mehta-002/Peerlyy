export class UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;

    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
    }
}
