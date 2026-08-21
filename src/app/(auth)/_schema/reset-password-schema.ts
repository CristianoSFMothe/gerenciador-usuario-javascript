import { z } from 'zod'

import { passwordSchema } from './shared'

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, 'Informe o código de 6 dígitos.')
      .regex(/^\d+$/, 'O código deve conter apenas números.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
