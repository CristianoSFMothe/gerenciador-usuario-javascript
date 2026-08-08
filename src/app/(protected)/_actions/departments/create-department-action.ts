'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

import {
  type DepartmentInput,
  departmentSchema,
} from '../../dashboard/departments/_schema/department-schema'

type CreateDepartmentActionResult =
  { success: true; message: string } | { success: false; message: string }

const DEPARTMENT_ALREADY_EXISTS_MESSAGE =
  'Essa empresa já possui um departamento cadastrado com esse nome.'

export const createDepartmentAction = async (
  data: DepartmentInput,
): Promise<CreateDepartmentActionResult> => {
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

  try {
    await prisma.department.create({
      data: {
        name: parsed.data.name,
        companyId: parsed.data.companyId,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, message: DEPARTMENT_ALREADY_EXISTS_MESSAGE }
    }

    throw error
  }

  return { success: true, message: 'Departamento cadastrado com sucesso.' }
}
