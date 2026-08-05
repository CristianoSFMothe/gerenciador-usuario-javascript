'use server'

import {
  type CompanyInput,
  companySchema,
} from '../../dashboard/companies/_schema/company-schema'

type CreateCompanyActionResult =
  { success: true; message: string } | { success: false; message: string }

export const createCompanyAction = async (
  data: CompanyInput,
): Promise<CreateCompanyActionResult> => {
  const parsed = companySchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  // TODO(Fase 4 - CRUD): persistir via Prisma (Company) quando o schema
  // estiver disponível.
  console.warn('createCompanyAction (ainda não persiste):', parsed.data)

  return { success: true, message: 'Empresa cadastrada com sucesso.' }
}
