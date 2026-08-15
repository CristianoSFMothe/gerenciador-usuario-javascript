'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

import {
  type DepartmentInput,
  departmentSchema,
} from '../../dashboard/departments/_schema/department-schema'

type UpdateDepartmentActionResult =
  { success: true; message: string } | { success: false; message: string }

const DEPARTMENT_ALREADY_EXISTS_MESSAGE =
  'Essa empresa já possui um departamento cadastrado com esse nome.'
const DEPARTMENT_NOT_FOUND_MESSAGE = 'Departamento não encontrado.'

export const updateDepartmentAction = async (
  id: string,
  data: DepartmentInput,
): Promise<UpdateDepartmentActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = departmentSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  const company = await prisma.company.findUnique({
    where: { id: parsed.data.companyId },
    select: { id: true },
  })

  if (!company) {
    return { success: false, message: 'Selecione uma empresa válida.' }
  }

  const existingDepartment = await prisma.department.findFirst({
    where: {
      companyId: parsed.data.companyId,
      name: parsed.data.name,
      id: { not: id },
    },
    select: { id: true },
  })

  if (existingDepartment) {
    return { success: false, message: DEPARTMENT_ALREADY_EXISTS_MESSAGE }
  }

  try {
    await prisma.department.update({
      where: { id },
      data: {
        name: parsed.data.name,
        companyId: parsed.data.companyId,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, message: DEPARTMENT_ALREADY_EXISTS_MESSAGE }
      }
      if (error.code === 'P2025') {
        return { success: false, message: DEPARTMENT_NOT_FOUND_MESSAGE }
      }
    }

    throw error
  }

  return { success: true, message: 'Departamento atualizado com sucesso.' }
}
