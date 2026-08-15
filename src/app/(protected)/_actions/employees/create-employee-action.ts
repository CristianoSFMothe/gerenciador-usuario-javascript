'use server'

import { randomUUID } from 'node:crypto'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import { Prisma } from '@/generated/prisma/client'

import {
  type EmployeeInput,
  employeeSchema,
} from '../../dashboard/employees/_schema/employee-schema'
import { resolveDepartmentTypeId } from '../departments/resolve-department-type-id'

type CreateEmployeeActionResult =
  { success: true; message: string } | { success: false; message: string }

const CPF_ALREADY_EXISTS_MESSAGE =
  'Já existe um funcionário cadastrado com esse CPF.'
const EMAIL_ALREADY_EXISTS_MESSAGE =
  'Já existe um funcionário cadastrado com esse e-mail.'
const REGISTRATION_NUMBER_PREFIX = 'FN'

export const createEmployeeAction = async (
  data: EmployeeInput,
): Promise<CreateEmployeeActionResult> => {
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
  })

  try {
    await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
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
          postalCode: parsed.data.postalCode
            ? onlyDigits(parsed.data.postalCode)
            : '',
          street: parsed.data.street,
          streetNumber: parsed.data.streetNumber || null,
          neighborhood: parsed.data.neighborhood,
          city: parsed.data.city,
          state: parsed.data.state,
          registrationNumber: randomUUID(),
        },
      })

      await tx.employee.update({
        where: { id: employee.id },
        data: {
          registrationNumber: `${REGISTRATION_NUMBER_PREFIX}${String(
            employee.sequentialNumber,
          ).padStart(6, '0')}`,
        },
      })
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target
      const fields = Array.isArray(target) ? target : []

      if (fields.includes('cpf')) {
        return { success: false, message: CPF_ALREADY_EXISTS_MESSAGE }
      }
      if (fields.includes('email')) {
        return { success: false, message: EMAIL_ALREADY_EXISTS_MESSAGE }
      }
    }

    throw error
  }

  return { success: true, message: 'Funcionário cadastrado com sucesso.' }
}
