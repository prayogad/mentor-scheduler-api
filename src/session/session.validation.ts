import { z, ZodType } from "zod";

export class SessionValidation {
    static readonly CREATE: ZodType = z.object({
        date: z.coerce.date().refine((date) => {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
            return date >= currentDate;
        }, "Date must be today or in the future"),
        time: z.string().time(),
        quota: z.number().min(1)
    })
}