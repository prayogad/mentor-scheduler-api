import { z, ZodType } from 'zod';

export class MentorValidation {
  static readonly PROFILE: ZodType = z.object({
    field: z.string().max(100).optional(),
    bio: z.string().optional(),
    file: z
      .any()
      .refine((file) => file && file.mimetype && file.mimetype.startsWith('image/'), {
        message: "Only image files are allowed",
      }),
  });
}
