'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

import {
  type PositionInput,
  positionSchema,
} from '../../dashboard/positions/_schema/position-schema'

type CreatePositionActionResult =
  { success: true; message: string } | { success: false; message: string }

const POSITION_ALREADY_EXISTS_MESSAGE =
  'Essa empresa já possui um cargo cadastrado com esse nome.'

export const createPositionAction = async (
  data: PositionInput,
): Promise<CreatePositionActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = positionSchema.safeParse(data)

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
    await prisma.position.create({
      data: {
        title: parsed.data.title,
        companyId: parsed.data.companyId,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, message: POSITION_ALREADY_EXISTS_MESSAGE }
    }

    throw error
  }

  return { success: true, message: 'Cargo cadastrado com sucesso.' }
}
