import { z, ZodType } from "zod";

export class MentorValidation {

    static readonly PROFILE: ZodType = z.object({
        field: z.string().min(1).max(100),
        bio: z.string().min(1)
    }) 
}