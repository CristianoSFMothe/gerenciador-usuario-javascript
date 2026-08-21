import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url('DATABASE_URL deve ser uma URL de conexão válida.'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET deve ter no mínimo 32 caracteres.'),
  BETTER_AUTH_URL: z.url('BETTER_AUTH_URL deve ser uma URL válida.'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Informe CLOUDINARY_CLOUD_NAME.'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Informe CLOUDINARY_API_KEY.'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Informe CLOUDINARY_API_SECRET.'),
  RESEND_API_KEY: z.string().min(1, 'Informe RESEND_API_KEY.'),
  EMAIL_FROM: z
    .string()
    .min(1)
    .default('Gerenciador de Usuários <onboarding@resend.dev>'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = z.prettifyError(parsed.error)

  throw new Error(
    `Variáveis de ambiente inválidas ou ausentes. Confira o .env com base no .env.example:\n${issues}`,
  )
}

export const env = parsed.data
