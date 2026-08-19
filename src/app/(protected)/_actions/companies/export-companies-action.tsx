'use server'

import { maskCNPJ, maskPhone } from '@/app/_utils/masks'

import { exportPdfAction, type ExportPdfResult } from '../export-pdf-action'
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

export const exportCompaniesAction = async (
  input: ExportCompaniesActionInput,
): Promise<ExportPdfResult> =>
  exportPdfAction({
    fetchItems: () =>
      getCompaniesForExport(
        input.mode === 'selected'
          ? { ids: input.ids }
          : {
              query: input.query,
              sortBy: input.sortBy,
              sortOrder: input.sortOrder,
              status: input.status,
            },
      ),
    emptyMessage: 'Nenhuma empresa para exportar.',
    filenamePrefix: 'empresas',
    buildDocument: (companies) => (
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
      />
    ),
  })
