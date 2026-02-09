export interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}
