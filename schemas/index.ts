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

export const LessonSchemaPart1 = z
    .object({
        title: z.string().max(100, { message: 'Lesson title must be at most 100 characters' }),
        description: z.optional(z.string().max(300, { message: 'Lesson description must be at most 300 characters' })),
    })

export const LessonSchemaVideo = z
    .object({
        order: z.number().max(100, { message: 'Lesson order must be at most 100' }),
        url: z.string().max(500, { message: 'Lesson vimeo url must be at most 500 characters' }),
        endText: z.optional(z.string().max(100, { message: 'Lesson end text must be at most 100 characters' })),
    })

export const LessonSchemaText= z
    .object({
        order: z.number().max(100, { message: 'Lesson order must be at most 100' }),
        content: z.string().max(10000, { message: 'Lesson content must be at most 10000 characters' }),
        endText: z.optional(z.string().max(100, { message: 'Lesson end text must be at most 100 characters' })),
    })

export const CourseSchema = z
    .object({
        title: z.string().max(100, { message: 'Course title must be at most 100 characters' }),
        description: z.optional(z.string().max(300, { message: 'Course description must be at most 300 characters' })),
    })

export const LessonSchema = z
    .object({
        title: z.optional(z.string().max(100, { message: 'Lesson title must be at most 100 characters' })),
        description: z.optional(z.string().max(300, { message: 'Lesson description must be at most 300 characters' })),
        endText: z.optional(z.string().max(100, { message: 'Lesson end text must be at most 100 characters' })),
        order: z.optional(z.number().max(100, { message: 'Lesson order must be at most 100 characters' })),
        url: z.optional(z.string().max(500, { message: 'Lesson vimeo url must be at most 500 characters' })),
        content: z.optional(z.string().max(10000, { message: 'Lesson content must be at most 10000 characters' })),
    })

export const EditCourseSchema = z
    .object({
        title: z.optional(z.string().max(100, { message: 'Course title must be at most 100 characters' })),
        description: z.optional(z.string().max(300, { message: 'Course description must be at most 300 characters' })),
    })