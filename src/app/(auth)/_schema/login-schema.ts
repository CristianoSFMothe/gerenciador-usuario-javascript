import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.').min(1, 'Informe seu e-mail.'),
  password: z.string().min(6, 'Informe sua senha.'),
})

export type LoginInput = z.infer<typeof loginSchema>
