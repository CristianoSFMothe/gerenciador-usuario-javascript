import { prisma } from '@/app/_lib/prisma'

export const getDepartment = async (id: string) => {
  return prisma.department.findUnique({ where: { id } })
}

export type DepartmentDetail = NonNullable<
  Awaited<ReturnType<typeof getDepartment>>
>
