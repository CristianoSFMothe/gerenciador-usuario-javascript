'use server'

import { APIError } from 'better-auth/api'

import { auth } from '@/app/_lib/auth'

import { emailSchema } from '../../_schema/shared'

type ResendVerificationResult =
  { success: true; message: string } | { success: false; message: string }

export const resendVerificationAction = async (
  email: string,
): Promise<ResendVerificationResult> => {
  const parsed = emailSchema.safeParse(email)

  if (!parsed.success) {
    return { success: false, message: 'Informe um e-mail válido.' }
  }

  try {
    await auth.api.sendVerificationEmail({
      body: { email: parsed.data, callbackURL: '/login?verified=1' },
    })

    return {
      success: true,
      message: 'Enviamos um novo e-mail de confirmação.',
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message }
    }

    return {
      success: false,
      message: 'Não foi possível reenviar o e-mail de confirmação.',
    }
  }
}
