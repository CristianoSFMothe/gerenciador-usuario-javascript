import { prisma } from '@/app/_lib/prisma'

export const getDepartmentTypes = async () => {
  return prisma.departmentType.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

export type DepartmentTypeOption = Awaited<
  ReturnType<typeof getDepartmentTypes>
>[number]
