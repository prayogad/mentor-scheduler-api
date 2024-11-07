import { z, ZodType } from 'zod';

export class MentorValidation {
  static readonly PROFILE: ZodType = z.object({
    field: z.string().max(100).optional(),
    bio: z.string().optional()
  });
}
