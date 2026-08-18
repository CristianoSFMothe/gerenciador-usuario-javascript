import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'Informe o nome da função.'),
  description: z.string().min(1, 'Informe a descrição.'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export type RoleInput = z.infer<typeof roleSchema>
