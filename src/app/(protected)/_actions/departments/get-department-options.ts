import { prisma } from '@/app/_lib/prisma'

export const getDepartmentOptions = async () => {
  return prisma.department.findMany({
    select: { id: true, name: true, companyId: true },
    orderBy: { name: 'asc' },
  })
}

export type DepartmentOption = Awaited<
  ReturnType<typeof getDepartmentOptions>
>[number]
