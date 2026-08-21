'use server'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'

import {
  type LoginOtpInput,
  loginOtpSchema,
} from '../../_schema/login-otp-schema'

type VerifyLoginOtpActionResult =
  { success: true; message: string } | { success: false; message: string }

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: 'Código inválido. Confira o código enviado por e-mail.',
  OTP_HAS_EXPIRED: 'O código expirou. Solicite um novo.',
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
    'Muitas tentativas. Solicite um novo código.',
  ACCOUNT_TEMPORARILY_LOCKED:
    'Muitas tentativas incorretas. Tente novamente em alguns minutos.',
  INVALID_TWO_FACTOR_COOKIE:
    'Sua sessão de login expirou. Faça login novamente.',
}

export const verifyLoginOtpAction = async (
  data: LoginOtpInput,
): Promise<VerifyLoginOtpActionResult> => {
  const parsed = loginOtpSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Informe o código de 6 dígitos.' }
  }

  try {
    await auth.api.verifyTwoFactorOTP({
      body: { code: parsed.data.code },
      headers: await headers(),
    })

    return { success: true, message: 'Login realizado com sucesso.' }
  } catch (error) {
    if (error instanceof APIError) {
      const code = error.body?.code
      const message = (code && ERROR_MESSAGES[code]) || error.message

      return { success: false, message }
    }

    return { success: false, message: 'Não foi possível confirmar o código.' }
  }
}
