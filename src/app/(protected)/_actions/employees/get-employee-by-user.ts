import { prisma } from '@/app/_lib/prisma'

export const getEmployeeByUser = async (userId: string) => {
  return prisma.employee.findUnique({
    where: { userId },
    include: {
      company: { select: { tradeName: true } },
      employmentHistory: { orderBy: { startDate: 'asc' } },
      salaryHistory: { orderBy: { effectiveDate: 'asc' } },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      },
      auditLogs: {
        orderBy: { changedAt: 'desc' },
        include: { changedBy: { select: { name: true } } },
      },
    },
  })
}

export type EmployeeProfile = Awaited<ReturnType<typeof getEmployeeByUser>>
