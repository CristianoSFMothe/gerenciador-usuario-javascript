import { prisma } from '@/app/_lib/prisma'

export const getCompanyOptions = async () => {
  return prisma.company.findMany({
    where: { active: true },
    select: { id: true, tradeName: true },
    orderBy: { tradeName: 'asc' },
  })
}

export type CompanyOption = Awaited<
  ReturnType<typeof getCompanyOptions>
>[number]
