import { prisma } from '@/app/_lib/prisma'

export const getCompany = async (id: string) => {
  return prisma.company.findUnique({ where: { id } })
}

export type CompanyDetail = NonNullable<Awaited<ReturnType<typeof getCompany>>>
