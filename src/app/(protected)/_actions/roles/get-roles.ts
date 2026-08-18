import { prisma } from '@/app/_lib/prisma'

export const getRoles = async () => {
  const [roles, permissions, rolePermissions] = await Promise.all([
    prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { users: true } } },
    }),
    prisma.permission.findMany({ orderBy: { order: 'asc' } }),
    prisma.rolePermission.findMany(),
  ])

  return { roles, permissions, rolePermissions }
}

export type RolesData = Awaited<ReturnType<typeof getRoles>>
export type RoleListItem = RolesData['roles'][number]
export type PermissionItem = RolesData['permissions'][number]
