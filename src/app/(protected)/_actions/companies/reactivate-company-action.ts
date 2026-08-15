'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

type ReactivateCompanyActionResult =
  { success: true; message: string } | { success: false; message: string }

export const reactivateCompanyAction = async (
  id: string,
): Promise<ReactivateCompanyActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  try {
    await prisma.company.update({ where: { id }, data: { active: true } })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return { success: false, message: 'Empresa não encontrada.' }
    }

    throw error
  }

  return { success: true, message: 'Empresa reativada com sucesso.' }
}
