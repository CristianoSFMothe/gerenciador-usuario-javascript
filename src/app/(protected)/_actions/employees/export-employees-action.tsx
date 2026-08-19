'use server'

import { renderToBuffer } from '@react-pdf/renderer'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { maskCPF, maskPhone } from '@/app/_utils/masks'

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

type ExportEmployeesActionResult =
  | { success: true; base64: string; filename: string }
  | { success: false; message: string }

const STATUS_LABEL = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
} as const

export const exportEmployeesAction = async (
  input: ExportEmployeesActionInput,
): Promise<ExportEmployeesActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const employees = await getEmployeesForExport(
    input.mode === 'selected'
      ? { ids: input.ids }
      : {
          query: input.query,
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
          status: input.status,
        },
  )

  if (employees.length === 0) {
    return { success: false, message: 'Nenhum funcionário para exportar.' }
  }

  const buffer = await renderToBuffer(
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
    />,
  )

  return {
    success: true,
    base64: buffer.toString('base64'),
    filename: `funcionarios-${Date.now()}.pdf`,
  }
}
