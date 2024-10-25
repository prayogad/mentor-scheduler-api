export class MentorResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  field: string;
  bio: string;
  schedule?: MentorSchedule[];
}

export class ProfileRequest {
  field: string;
  bio: string;
}

export class MentorSchedule {
  id: number;
  quota: number;
  scheduleAt: Date
}