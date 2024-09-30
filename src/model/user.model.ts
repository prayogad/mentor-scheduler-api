export class UserResponse {
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