import { z } from 'zod'

import { otpCodeSchema, passwordSchema } from './shared'

export const resetPasswordSchema = z
  .object({
    otp: otpCodeSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
