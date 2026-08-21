import { z } from 'zod'

import { otpCodeSchema } from './shared'

export const loginOtpSchema = z.object({
  code: otpCodeSchema,
})

export type LoginOtpInput = z.infer<typeof loginOtpSchema>
