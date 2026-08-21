'use server'

import { APIError } from 'better-auth/api'

import { auth } from '@/app/_lib/auth'

import { emailSchema } from '../../_schema/shared'

type ForgotPasswordActionResult =
  { success: true; message: string } | { success: false; message: string }

export const forgotPasswordAction = async (
  email: string,
): Promise<ForgotPasswordActionResult> => {
  const parsed = emailSchema.safeParse(email)

  if (!parsed.success) {
    return { success: false, message: 'Informe um e-mail válido.' }
  }

  try {
    await auth.api.requestPasswordResetEmailOTP({
      body: { email: parsed.data },
    })

    return {
      success: true,
      message:
        'Se este e-mail estiver cadastrado, enviamos um código para redefinir a senha.',
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message }
    }

    return { success: false, message: 'Não foi possível enviar o código.' }
  }
}
