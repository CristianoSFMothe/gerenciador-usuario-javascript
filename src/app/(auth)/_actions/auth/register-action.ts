'use server'

import { APIError } from 'better-auth/api'

import { auth } from '@/app/_lib/auth'

import type { RegisterInput } from '../../_schema/register-schema'

type RegisterActionResult =
  { success: true; message: string } | { success: false; message: string }

const ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Este e-mail já está cadastrado.',
  PASSWORD_TOO_SHORT: 'A senha é muito curta.',
  PASSWORD_TOO_LONG: 'A senha é muito longa.',
}

export const registerAction = async (
  data: RegisterInput,
): Promise<RegisterActionResult> => {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    })

    return { success: true, message: 'Conta criada com sucesso.' }
  } catch (error) {
    if (error instanceof APIError) {
      const code = error.body?.code
      const message = (code && ERROR_MESSAGES[code]) || error.message

      return { success: false, message }
    }

    return { success: false, message: 'Não foi possível criar a conta.' }
  }
}
