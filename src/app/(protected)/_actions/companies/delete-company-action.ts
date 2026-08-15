'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'

type DeleteCompanyActionResult =
  { success: true; message: string } | { success: false; message: string }

export const deleteCompanyAction = async (
  id: string,
): Promise<DeleteCompanyActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const company = await prisma.company.findUnique({
    where: { id },
    select: {
      _count: {
        select: { employees: true, positions: true, departments: true },
      },
    },
  })

  if (!company) {
    return { success: false, message: 'Empresa não encontrada.' }
  }

  const hasDependents =
    company._count.employees > 0 ||
    company._count.positions > 0 ||
    company._count.departments > 0

  if (hasDependents) {
    await prisma.company.update({ where: { id }, data: { active: false } })
    return {
      success: true,
      message:
        'Empresa possui registros vinculados e foi marcada como inativa.',
    }
  }

  await prisma.company.delete({ where: { id } })
  return { success: true, message: 'Empresa excluída com sucesso.' }
}
