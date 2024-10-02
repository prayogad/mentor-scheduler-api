export class MentorResponse {
    id: number;
    email: string;
    name: string;
    phone: string;
    field: string;
    bio: string;
}

export class ProfileRequest {
    field: string;
    bio: string;
}