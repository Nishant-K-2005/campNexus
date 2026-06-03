import {email, z} from "zod"

export const signupSchema = z.object({
    email: z.email(),
    pass: z.string().min(8),
    full_name: z.string().min(2),
    role: z.enum(["Student","Professor","Club Head"])
})

export const loginSchema = z.object({
    email: z.email(),
    pass: z.string()
})