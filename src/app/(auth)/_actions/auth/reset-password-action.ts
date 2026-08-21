'use server'

import { APIError } from 'better-auth/api'

import { auth } from '@/app/_lib/auth'

import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '../../_schema/reset-password-schema'
import { emailSchema } from '../../_schema/shared'

type ResetPasswordActionResult =
  { success: true; message: string } | { success: false; message: string }

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_OTP: 'Código inválido. Confira o código enviado por e-mail.',
  OTP_EXPIRED: 'O código expirou. Solicite um novo.',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas. Solicite um novo código.',
  USER_NOT_FOUND: 'Não encontramos uma conta com este e-mail.',
  PASSWORD_TOO_SHORT: 'A senha é muito curta.',
  PASSWORD_TOO_LONG: 'A senha é muito longa.',
}

export const resetPasswordAction = async (
  email: string,
  data: ResetPasswordInput,
): Promise<ResetPasswordActionResult> => {
  const parsedEmail = emailSchema.safeParse(email)
  const parsedData = resetPasswordSchema.safeParse(data)

  if (!parsedEmail.success || !parsedData.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email: parsedEmail.data,
        otp: parsedData.data.otp,
        password: parsedData.data.password,
      },
    })

    return { success: true, message: 'Senha redefinida com sucesso!' }
  } catch (error) {
    if (error instanceof APIError) {
      const code = error.body?.code
      const message = (code && ERROR_MESSAGES[code]) || error.message

      return { success: false, message }
    }

    return { success: false, message: 'Não foi possível redefinir a senha.' }
  }
}
