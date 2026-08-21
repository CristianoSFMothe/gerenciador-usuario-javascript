'use server'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'

type SendLoginOtpActionResult =
  { success: true; message: string } | { success: false; message: string }

export const sendLoginOtpAction =
  async (): Promise<SendLoginOtpActionResult> => {
    try {
      await auth.api.sendTwoFactorOTP({
        headers: await headers(),
      })

      return {
        success: true,
        message: 'Enviamos um código de confirmação para seu e-mail.',
      }
    } catch (error) {
      if (error instanceof APIError) {
        return { success: false, message: error.message }
      }

      return { success: false, message: 'Não foi possível enviar o código.' }
    }
  }
