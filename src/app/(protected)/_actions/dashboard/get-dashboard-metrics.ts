import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { prisma } from '@/app/_lib/prisma'

const GROWTH_MONTHS_RANGE = 6

export const getDashboardMetrics = async () => {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)

  const [
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    totalBeforeCurrentMonth,
    departmentGroups,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.employee.count({ where: { status: 'INACTIVE' } }),
    prisma.employee.count({ where: { createdAt: { lt: currentMonthStart } } }),
    prisma.employee.groupBy({ by: ['departmentId'], _count: { _all: true } }),
  ])

  const growthPercent =
    totalBeforeCurrentMonth > 0
      ? Math.round(
          ((totalEmployees - totalBeforeCurrentMonth) /
            totalBeforeCurrentMonth) *
            100,
        )
      : totalEmployees > 0
        ? 100
        : 0

  const months = Array.from({ length: GROWTH_MONTHS_RANGE }, (_, index) =>
    subMonths(now, GROWTH_MONTHS_RANGE - 1 - index),
  )

  const userGrowth = await Promise.all(
    months.map(async (month) => {
      const total = await prisma.employee.count({
        where: { createdAt: { lte: endOfMonth(month) } },
      })

      return { month: format(month, 'MMM', { locale: ptBR }), total }
    }),
  )

  const departments = await prisma.department.findMany({
    where: { id: { in: departmentGroups.map((group) => group.departmentId) } },
    select: { id: true, departmentType: { select: { name: true } } },
  })
  const departmentNameById = new Map(
    departments.map((department) => [
      department.id,
      department.departmentType.name,
    ]),
  )

  const departmentBreakdown = departmentGroups
    .map((group) => ({
      name: departmentNameById.get(group.departmentId) ?? 'Outros',
      count: group._count._all,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    growthPercent,
    userGrowth,
    departmentBreakdown,
  }
}

export type DashboardMetrics = Awaited<ReturnType<typeof getDashboardMetrics>>
