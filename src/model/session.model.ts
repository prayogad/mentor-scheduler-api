export class SessionResponse {
    id: number;
    scheduledAt: Date;
    quota: number;
    mentor_name?: string;
    student_name?: string;
    field?: string;
}

export class BookSessionResponse {
    scheduledAt: Date;
    mentor_name: string;
    student_name: string;
    field: string;
    bookedAt: Date;
}

export class AddSessionRequest {
    scheduledAt: string;
    quota: number;
}

export class UpdateSessionRequest {
    id: number;
    scheduledAt?: Date;
    quota?: number;
}

export class BookSessionRequest {
    mentor_id: number;
    session_id: number;
}