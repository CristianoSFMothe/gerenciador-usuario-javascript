'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'

type PermissionGrant = {
  roleId: string
  permissionId: string
  granted: boolean
}

type UpdateRolePermissionsActionResult =
  { success: true; message: string } | { success: false; message: string }

export const updateRolePermissionsAction = async (
  grants: PermissionGrant[],
): Promise<UpdateRolePermissionsActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  await prisma.$transaction(
    grants.map((grant) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: grant.roleId,
            permissionId: grant.permissionId,
          },
        },
        update: { granted: grant.granted },
        create: grant,
      }),
    ),
  )

  return { success: true, message: 'Permissões atualizadas com sucesso.' }
}
