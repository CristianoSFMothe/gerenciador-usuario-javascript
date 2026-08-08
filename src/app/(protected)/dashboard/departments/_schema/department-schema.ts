import { z } from 'zod'

export const departmentSchema = z.object({
  companyId: z.string().min(1, 'Selecione a empresa.'),
  name: z.string().min(1, 'Informe o nome do departamento.'),
})

export type DepartmentInput = z.infer<typeof departmentSchema>
