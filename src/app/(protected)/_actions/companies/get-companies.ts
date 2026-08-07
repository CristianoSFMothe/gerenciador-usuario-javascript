import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

type GetCompaniesParams = {
  query?: string
  page?: number
}

export const getCompanies = async ({
  query = '',
  page = 1,
}: GetCompaniesParams) => {
  const trimmedQuery = query.trim()
  const queryDigits = onlyDigits(trimmedQuery)

  const where: Prisma.CompanyWhereInput = trimmedQuery
    ? {
        OR: [
          { tradeName: { contains: trimmedQuery, mode: 'insensitive' } },
          { legalName: { contains: trimmedQuery, mode: 'insensitive' } },
          ...(queryDigits ? [{ cnpj: { contains: queryDigits } }] : []),
        ],
      }
    : {}

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { tradeName: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.company.count({ where }),
  ])

  return { companies, totalCount, pageSize: PAGE_SIZE }
}

export type CompanyListItem = Awaited<
  ReturnType<typeof getCompanies>
>['companies'][number]
