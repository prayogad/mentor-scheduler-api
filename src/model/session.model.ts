export class SessionResponse {
    id: number;
    scheduledAt: Date;
    quota: number;
}

export class AddSessionRequest {
    scheduledAt: string;
    quota: number;
}