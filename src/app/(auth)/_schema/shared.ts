import { z } from 'zod'

export const emailSchema = z
  .email('Informe um e-mail válido.')
  .min(1, 'Informe seu e-mail.')
