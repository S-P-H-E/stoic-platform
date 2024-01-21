import * as z from 'zod';

export const SettingsSchema = z
    .object({
        name: z.optional(z.string().max(40, { message: 'Name must be at most 40 characters' })),
        description: z.optional(z.string().max(250, { message: 'Description must be at most 250 characters' })),
        social: z.optional(z.string().max(250, { message: 'Description must be at most 250 characters'})),
    })

    // password change schema here with old new pass

export const DashboardSchema = z
    .object({
        name: z.string().max(100, { message: 'Name must be at most 100 characters' }),
        description: z.optional(z.string().max(200, { message: 'Description must be at most 200 characters' }))
})