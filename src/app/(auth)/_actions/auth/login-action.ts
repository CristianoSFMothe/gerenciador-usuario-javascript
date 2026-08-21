'use server'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'

import { type LoginInput, loginSchema } from '../../_schema/login-schema'

type LoginActionResult =
  | { success: true; twoFactorRequired: true }
  | { success: true; twoFactorRequired: false; message: string }
  | { success: false; message: string; code?: 'EMAIL_NOT_VERIFIED' }

export const loginAction = async (
  data: LoginInput,
): Promise<LoginActionResult> => {
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    })

    // Todo login exige um segundo fator por e-mail (ver twoFactor em
    // _lib/auth.ts); o Better Auth já derruba a sessão de credencial e
    // troca por um cookie temporário de desafio antes de chegar aqui.
    if ('twoFactorRedirect' in result && result.twoFactorRedirect) {
      return { success: true, twoFactorRequired: true }
    }

    return {
      success: true,
      twoFactorRequired: false,
      message: 'Login realizado com sucesso.',
    }
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
        return { success: false, message: 'E-mail ou senha inválidos.' }
      }

      if (error.body?.code === 'EMAIL_NOT_VERIFIED') {
        return {
          success: false,
          message:
            'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.',
          code: 'EMAIL_NOT_VERIFIED',
        }
      }

      return { success: false, message: error.message }
    }

    return { success: false, message: 'Não foi possível entrar.' }
  }
}
