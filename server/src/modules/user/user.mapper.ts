import { UserResponseDTO } from './dto/user-response.dto.js';

export const toUserResponse = (user: any): UserResponseDTO => {
    return new UserResponseDTO(user);
};
