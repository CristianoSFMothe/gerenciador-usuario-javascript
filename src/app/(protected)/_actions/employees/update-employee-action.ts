'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { formatCurrencyBRL } from '@/app/_utils/format-currency'
import { onlyDigits, parseCurrency } from '@/app/_utils/masks'
import { Prisma } from '@/generated/prisma/client'

import {
  type EmployeeInput,
  employeeSchema,
} from '../../dashboard/employees/_schema/employee-schema'
import { resolveDepartmentTypeId } from '../departments/resolve-department-type-id'

type UpdateEmployeeActionResult =
  { success: true; message: string } | { success: false; message: string }

type AuditEntry = {
  employeeId: string
  field: 'POSITION' | 'DEPARTMENT' | 'SALARY'
  oldValue: string | null
  newValue: string
  changedById: string
  changedAt: Date
}

const CPF_ALREADY_EXISTS_MESSAGE =
  'Já existe um funcionário cadastrado com esse CPF.'
const EMAIL_ALREADY_EXISTS_MESSAGE =
  'Já existe um funcionário cadastrado com esse e-mail.'
const EMPLOYEE_NOT_FOUND_MESSAGE = 'Funcionário não encontrado.'

export const updateEmployeeAction = async (
  id: string,
  data: EmployeeInput,
): Promise<UpdateEmployeeActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = employeeSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  const currentEmployee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: { include: { departmentType: true } },
      employmentHistory: { where: { endDate: null } },
    },
  })

  if (!currentEmployee) {
    return { success: false, message: EMPLOYEE_NOT_FOUND_MESSAGE }
  }

  const departmentTypeId = await resolveDepartmentTypeId(
    parsed.data.departmentTypeId,
    parsed.data.customDepartmentName,
  )

  const department = await prisma.department.upsert({
    where: {
      companyId_departmentTypeId: {
        companyId: parsed.data.companyId,
        departmentTypeId,
      },
    },
    update: {},
    create: {
      companyId: parsed.data.companyId,
      departmentTypeId,
    },
    include: { departmentType: true },
  })

  const salary = parseCurrency(parsed.data.salary)
  const previousSalary = currentEmployee.salary?.toNumber() ?? null
  const positionChanged = currentEmployee.position !== parsed.data.position
  const departmentChanged = currentEmployee.departmentId !== department.id
  const salaryChanged = previousSalary !== salary

  try {
    await prisma.$transaction(async (tx) => {
      await tx.employee.update({
        where: { id },
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          phone: onlyDigits(parsed.data.phone),
          cpf: onlyDigits(parsed.data.cpf),
          email: parsed.data.email,
          birthDate: new Date(parsed.data.birthDate),
          gender: parsed.data.gender,
          companyId: parsed.data.companyId,
          position: parsed.data.position,
          departmentId: department.id,
          salary,
          postalCode: parsed.data.postalCode
            ? onlyDigits(parsed.data.postalCode)
            : '',
          street: parsed.data.street,
          streetNumber: parsed.data.streetNumber || null,
          neighborhood: parsed.data.neighborhood,
          city: parsed.data.city,
          state: parsed.data.state,
        },
      })

      const now = new Date()

      if (positionChanged || departmentChanged) {
        const openHistory = currentEmployee.employmentHistory[0]

        if (openHistory) {
          await tx.employmentHistory.update({
            where: { id: openHistory.id },
            data: { endDate: now },
          })
        }

        await tx.employmentHistory.create({
          data: {
            employeeId: id,
            position: parsed.data.position,
            description: parsed.data.positionDescription || null,
            startDate: now,
          },
        })
      }

      if (salaryChanged) {
        await tx.salaryHistory.create({
          data: {
            employeeId: id,
            amount: salary,
            reason: 'OTHER',
            effectiveDate: now,
          },
        })
      }

      const auditEntries: AuditEntry[] = []

      if (positionChanged) {
        auditEntries.push({
          employeeId: id,
          field: 'POSITION',
          oldValue: currentEmployee.position,
          newValue: parsed.data.position,
          changedById: session.user.id,
          changedAt: now,
        })
      }

      if (departmentChanged) {
        auditEntries.push({
          employeeId: id,
          field: 'DEPARTMENT',
          oldValue: currentEmployee.department.departmentType.name,
          newValue: department.departmentType.name,
          changedById: session.user.id,
          changedAt: now,
        })
      }

      if (salaryChanged) {
        auditEntries.push({
          employeeId: id,
          field: 'SALARY',
          oldValue:
            previousSalary === null ? null : formatCurrencyBRL(previousSalary),
          newValue: formatCurrencyBRL(salary),
          changedById: session.user.id,
          changedAt: now,
        })
      }

      if (auditEntries.length > 0) {
        await tx.employeeAuditLog.createMany({ data: auditEntries })
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target
        const fields = Array.isArray(target) ? target : []

        if (fields.includes('cpf')) {
          return { success: false, message: CPF_ALREADY_EXISTS_MESSAGE }
        }
        if (fields.includes('email')) {
          return { success: false, message: EMAIL_ALREADY_EXISTS_MESSAGE }
        }
      }
      if (error.code === 'P2025') {
        return { success: false, message: EMPLOYEE_NOT_FOUND_MESSAGE }
      }
    }

    throw error
  }

  return { success: true, message: 'Funcionário atualizado com sucesso.' }
}
