import { z, ZodType } from "zod";

export class SessionValidation {
    static readonly CREATE: ZodType = z.object({
        scheduledAt: z.coerce.date().refine((date) => {
            const now = new Date();
            return date > now;
        }, 'scheduled time cannot in the past'),
        quota: z.number().min(1)
    });
    
    static readonly UPDATE: ZodType = z.object({
        id: z.number().min(1).positive(),
        scheduledAt: z.coerce.date().refine((date) => {
            const now = new Date();
            return date > now;
        }, 'scheduled time cannot in the past').optional(),
        quota: z.number().min(1).optional()
    });

    static readonly BOOK: ZodType = z.object({
        session_id: z.number().min(1).positive(),
    })
}