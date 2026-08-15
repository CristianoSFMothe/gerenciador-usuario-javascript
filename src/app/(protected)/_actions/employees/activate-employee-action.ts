'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'

type ActivateEmployeeActionResult =
  { success: true; message: string } | { success: false; message: string }

export const activateEmployeeAction = async (
  id: string,
): Promise<ActivateEmployeeActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const employee = await prisma.employee.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!employee) {
    return { success: false, message: 'Funcionário não encontrado.' }
  }

  await prisma.employee.update({
    where: { id },
    data: { status: 'ACTIVE' },
  })

  return { success: true, message: 'Funcionário ativado com sucesso.' }
}
