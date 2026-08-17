'use server'

import { renderToBuffer } from '@react-pdf/renderer'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { maskCNPJ, maskPhone } from '@/app/_utils/masks'

import CompaniesPdfDocument from './companies-pdf-document'
import { getCompaniesForExport } from './get-companies'

type ExportCompaniesActionInput =
  | { mode: 'selected'; ids: string[] }
  | {
      mode: 'all'
      query?: string
      sortBy?: string
      sortOrder?: string
      status?: string
    }

type ExportCompaniesActionResult =
  | { success: true; base64: string; filename: string }
  | { success: false; message: string }

export const exportCompaniesAction = async (
  input: ExportCompaniesActionInput,
): Promise<ExportCompaniesActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const companies = await getCompaniesForExport(
    input.mode === 'selected'
      ? { ids: input.ids }
      : {
          query: input.query,
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
          status: input.status,
        },
  )

  if (companies.length === 0) {
    return { success: false, message: 'Nenhuma empresa para exportar.' }
  }

  const buffer = await renderToBuffer(
    <CompaniesPdfDocument
      generatedAt={new Date()}
      companies={companies.map((company) => ({
        tradeName: company.tradeName,
        legalName: company.legalName,
        cnpj: maskCNPJ(company.cnpj),
        email: company.email,
        website: company.website ?? '-',
        landlinePhone: maskPhone(company.landlinePhone),
        postalCode: company.postalCode ?? '-',
        status: company.active ? 'Ativa' : 'Inativa',
      }))}
    />,
  )

  return {
    success: true,
    base64: buffer.toString('base64'),
    filename: `empresas-${Date.now()}.pdf`,
  }
}
