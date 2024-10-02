export class UserResponse {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: string;
    token?: string
}

export class RegisterUserRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: any;
}

export class LoginUserRequest {
    email: string;
    password: string;
}

export class UpdateUserRequest {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
}