import * as z from 'zod'

export const ZoheValidation = z.object({
    zohe: z.string().min(3).max(1000, {message: 'Maximum 1000 characters'}).nonempty(),
    accountId: z.string()
})

export const CommentValidation = z.object({
    zohe: z.string().min(3).max(1000, {message: 'Maximum 1000 characters'}).nonempty(),
})