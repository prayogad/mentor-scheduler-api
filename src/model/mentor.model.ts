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
  file?: Express.Multer.File;
}

export class MentorSchedule {
  id: number;
  quota: number;
  scheduleAt: Date
}