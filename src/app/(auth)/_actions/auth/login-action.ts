'use server'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'

import type { LoginInput } from '../../_schema/login-schema'

type LoginActionResult =
  { success: true; message: string } | { success: false; message: string }

export const loginAction = async (
  data: LoginInput,
): Promise<LoginActionResult> => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    })

    return { success: true, message: 'Login realizado com sucesso.' }
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
        return { success: false, message: 'E-mail ou senha inválidos.' }
      }

      return { success: false, message: error.message }
    }

    return { success: false, message: 'Não foi possível entrar.' }
  }
}
