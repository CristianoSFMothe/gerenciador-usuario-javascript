'use server'

import { maskCPF, maskPhone } from '@/app/_utils/masks'

import { exportPdfAction, type ExportPdfResult } from '../export-pdf-action'
import EmployeesPdfDocument from './employees-pdf-document'
import { getEmployeesForExport } from './get-employees'

type ExportEmployeesActionInput =
  | { mode: 'selected'; ids: string[] }
  | {
      mode: 'all'
      query?: string
      sortBy?: string
      sortOrder?: string
      status?: string
    }

const STATUS_LABEL = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
} as const

export const exportEmployeesAction = async (
  input: ExportEmployeesActionInput,
): Promise<ExportPdfResult> =>
  exportPdfAction({
    fetchItems: () =>
      getEmployeesForExport(
        input.mode === 'selected'
          ? { ids: input.ids }
          : {
              query: input.query,
              sortBy: input.sortBy,
              sortOrder: input.sortOrder,
              status: input.status,
            },
      ),
    emptyMessage: 'Nenhum funcionário para exportar.',
    filenamePrefix: 'funcionarios',
    buildDocument: (employees) => (
      <EmployeesPdfDocument
        generatedAt={new Date()}
        employees={employees.map((employee) => ({
          registrationNumber: employee.registrationNumber,
          firstName: employee.firstName,
          lastName: employee.lastName,
          cpf: maskCPF(employee.cpf),
          email: employee.email,
          phone: maskPhone(employee.phone),
          companyName: employee.company.tradeName,
          position: employee.position,
          departmentName: employee.department.departmentType.name,
          status: STATUS_LABEL[employee.status],
        }))}
      />
    ),
  })
