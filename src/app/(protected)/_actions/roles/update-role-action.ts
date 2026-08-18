'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

import {
  type RoleInput,
  roleSchema,
} from '../../dashboard/roles/_schema/role-schema'

type UpdateRoleActionResult =
  { success: true; message: string } | { success: false; message: string }

const NAME_ALREADY_EXISTS_MESSAGE = 'Já existe uma função com esse nome.'

export const updateRoleAction = async (
  id: string,
  data: RoleInput,
): Promise<UpdateRoleActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = roleSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  try {
    await prisma.role.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        status: parsed.data.status,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, message: NAME_ALREADY_EXISTS_MESSAGE }
    }

    throw error
  }

  return { success: true, message: 'Função atualizada com sucesso.' }
}
