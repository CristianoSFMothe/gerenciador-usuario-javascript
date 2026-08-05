'use server'

import {
  type EmployeeInput,
  employeeSchema,
} from '../../dashboard/employees/_schema/employee-schema'

type CreateEmployeeActionResult =
  { success: true; message: string } | { success: false; message: string }

export const createEmployeeAction = async (
  data: EmployeeInput,
): Promise<CreateEmployeeActionResult> => {
  const parsed = employeeSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  // TODO(Fase 4 - CRUD): persistir via Prisma (Employee) quando o cadastro
  // de Company/Position estiver disponível para popular os selects.
  console.warn('createEmployeeAction (ainda não persiste):', parsed.data)

  return { success: true, message: 'Pessoa cadastrada com sucesso.' }
}
