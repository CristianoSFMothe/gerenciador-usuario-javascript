import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
    email: z.email('Informe um e-mail válido.').min(1, 'Informe seu e-mail.'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres.')
      .regex(/[a-z]/, 'Inclua ao menos uma letra minúscula.')
      .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula.')
      .regex(/[0-9]/, 'Inclua ao menos um número.'),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
