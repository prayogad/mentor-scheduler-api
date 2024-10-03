import { z, ZodType } from "zod";

export class SessionValidation {
    static readonly CREATE: ZodType = z.object({
        scheduledAt: z.coerce.date().refine((date) => {
            const now = new Date();
            return date > now;
        }, 'scheduled time cannot in the past'),
        quota: z.number().min(1)
    })
}