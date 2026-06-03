import {z} from 'zod'

export const createCommunitySchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(20),
    tags: z.array(z.string()).min(3)
})