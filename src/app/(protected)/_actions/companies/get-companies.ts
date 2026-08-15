import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export type CompanySortField =
  | 'tradeName'
  | 'cnpj'
  | 'email'
  | 'website'
  | 'landlinePhone'
  | 'mobilePhone'
  | 'postalCode'

export type CompanySortOrder = 'asc' | 'desc'

const SORTABLE_FIELDS: CompanySortField[] = [
  'tradeName',
  'cnpj',
  'email',
  'website',
  'landlinePhone',
  'mobilePhone',
  'postalCode',
]

const isSortableField = (value: string): value is CompanySortField =>
  SORTABLE_FIELDS.includes(value as CompanySortField)

type GetCompaniesParams = {
  query?: string
  page?: number
  sortBy?: string
  sortOrder?: string
}

export const getCompanies = async ({
  query = '',
  page = 1,
  sortBy,
  sortOrder,
}: GetCompaniesParams) => {
  const trimmedQuery = query.trim()
  const queryDigits = onlyDigits(trimmedQuery)

  const safeSortBy: CompanySortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'tradeName'
  const safeSortOrder: CompanySortOrder = sortOrder === 'desc' ? 'desc' : 'asc'

  const where: Prisma.CompanyWhereInput = {
    active: true,
    ...(trimmedQuery
      ? {
          OR: [
            { tradeName: { contains: trimmedQuery, mode: 'insensitive' } },
            { legalName: { contains: trimmedQuery, mode: 'insensitive' } },
            ...(queryDigits ? [{ cnpj: { contains: queryDigits } }] : []),
          ],
        }
      : {}),
  }

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: {
          select: { employees: true, positions: true, departments: true },
        },
      },
    }),
    prisma.company.count({ where }),
  ])

  return {
    companies,
    totalCount,
    pageSize: PAGE_SIZE,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  }
}

export type CompanyListItem = Awaited<
  ReturnType<typeof getCompanies>
>['companies'][number]
