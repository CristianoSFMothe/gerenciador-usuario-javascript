import { z } from 'zod'

import { emailSchema, passwordSchema } from './shared'

export const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
