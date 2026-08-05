import { z } from 'zod'

import { emailSchema } from './shared'

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Informe sua senha.'),
})

export type LoginInput = z.infer<typeof loginSchema>
