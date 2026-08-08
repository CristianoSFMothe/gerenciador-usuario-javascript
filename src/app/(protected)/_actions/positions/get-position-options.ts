import { prisma } from '@/app/_lib/prisma'

export const getPositionOptions = async () => {
  return prisma.position.findMany({
    select: { id: true, title: true, companyId: true },
    orderBy: { title: 'asc' },
  })
}

export type PositionOption = Awaited<
  ReturnType<typeof getPositionOptions>
>[number]
