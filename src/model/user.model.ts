export class UserResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  field?: string;
  bio?: string;  
  access_token?: string;
  refresh_token?: string;
}

export class DashboardResponse {
  mentor_name: string;
  student_name: string;
  scheduledAt: Date;
  field: string;
}

export class RegisterUserRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
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
