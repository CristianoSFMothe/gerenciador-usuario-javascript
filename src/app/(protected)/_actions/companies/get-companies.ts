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
  | 'active'

export type CompanySortOrder = 'asc' | 'desc'

export type CompanyStatusFilter = 'active' | 'inactive' | 'all'

const SORTABLE_FIELDS: CompanySortField[] = [
  'tradeName',
  'cnpj',
  'email',
  'website',
  'landlinePhone',
  'mobilePhone',
  'postalCode',
  'active',
]

const STATUS_FILTERS: CompanyStatusFilter[] = ['active', 'inactive', 'all']

const isSortableField = (value: string): value is CompanySortField =>
  SORTABLE_FIELDS.includes(value as CompanySortField)

const isStatusFilter = (value: string): value is CompanyStatusFilter =>
  STATUS_FILTERS.includes(value as CompanyStatusFilter)

type GetCompaniesParams = {
  query?: string
  page?: number
  sortBy?: string
  sortOrder?: string
  status?: string
}

export const getCompanies = async ({
  query = '',
  page = 1,
  sortBy,
  sortOrder,
  status,
}: GetCompaniesParams) => {
  const trimmedQuery = query.trim()
  const queryDigits = onlyDigits(trimmedQuery)

  const safeSortBy: CompanySortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'tradeName'
  const safeSortOrder: CompanySortOrder = sortOrder === 'desc' ? 'desc' : 'asc'
  const safeStatus: CompanyStatusFilter =
    status && isStatusFilter(status) ? status : 'active'

  const where: Prisma.CompanyWhereInput = {
    ...(safeStatus === 'active' && { active: true }),
    ...(safeStatus === 'inactive' && { active: false }),
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
          select: { employees: true, departments: true },
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
    status: safeStatus,
  }
}

export type CompanyListItem = Awaited<
  ReturnType<typeof getCompanies>
>['companies'][number]
