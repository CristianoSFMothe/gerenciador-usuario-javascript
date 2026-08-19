import { prisma } from '@/app/_lib/prisma'

export const getEmployee = async (id: string) => {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      department: { select: { departmentTypeId: true } },
      employmentHistory: { where: { endDate: null }, take: 1 },
    },
  })
}

export type EmployeeDetail = NonNullable<
  Awaited<ReturnType<typeof getEmployee>>
>
