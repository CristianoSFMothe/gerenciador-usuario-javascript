import { z } from 'zod'

export const emailSchema = z
  .email('Informe um e-mail válido.')
  .min(1, 'Informe seu e-mail.')

export const passwordSchema = z
  .string()
  .min(6, 'A senha deve ter no mínimo 6 caracteres.')
  .regex(/[a-z]/, 'Inclua ao menos uma letra minúscula.')
  .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula.')
  .regex(/[0-9]/, 'Inclua ao menos um número.')

export const otpCodeSchema = z
  .string()
  .length(6, 'Informe o código de 6 dígitos.')
  .regex(/^\d+$/, 'O código deve conter apenas números.')
