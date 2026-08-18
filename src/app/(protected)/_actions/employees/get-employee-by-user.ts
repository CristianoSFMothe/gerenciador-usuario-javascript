import { prisma } from '@/app/_lib/prisma'

export const getEmployeeByUser = async (userId: string) => {
  return prisma.employee.findUnique({
    where: { userId },
    include: {
      company: { select: { tradeName: true } },
      employmentHistory: { orderBy: { startDate: 'asc' } },
    },
  })
}

export type EmployeeProfile = Awaited<ReturnType<typeof getEmployeeByUser>>
