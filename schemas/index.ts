import * as z from 'zod';

export const SettingsSchema = z
    .object({
        name: z.optional(z.string().max(40, { message: 'Name must be at most 40 character(s)' })),
        description: z.optional(z.string().max(250, { message: 'Description must be at most 250 character(s)' })),
        social: z.optional(z.string().max(250, { message: 'Description must be at most 250 character(s)'})),
    })

    // password change schema here with old new pass