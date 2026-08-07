import { z } from 'zod'

export const positionSchema = z.object({
  companyId: z.string().min(1, 'Selecione a empresa.'),
  title: z.string().min(1, 'Informe o nome do cargo.'),
})

export type PositionInput = z.infer<typeof positionSchema>
