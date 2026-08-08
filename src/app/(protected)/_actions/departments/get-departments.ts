import { prisma } from '@/app/_lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export type DepartmentSortField = 'name' | 'company'
export type DepartmentSortOrder = 'asc' | 'desc'

const SORTABLE_FIELDS: DepartmentSortField[] = ['name', 'company']

const isSortableField = (value: string): value is DepartmentSortField =>
  SORTABLE_FIELDS.includes(value as DepartmentSortField)

type GetDepartmentsParams = {
  query?: string
  page?: number
  sortBy?: string
  sortOrder?: string
}

export const getDepartments = async ({
  query = '',
  page = 1,
  sortBy,
  sortOrder,
}: GetDepartmentsParams) => {
  const trimmedQuery = query.trim()

  const safeSortBy: DepartmentSortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'name'
  const safeSortOrder: DepartmentSortOrder =
    sortOrder === 'desc' ? 'desc' : 'asc'

  const where: Prisma.DepartmentWhereInput = trimmedQuery
    ? {
        OR: [
          { name: { contains: trimmedQuery, mode: 'insensitive' } },
          {
            company: {
              tradeName: { contains: trimmedQuery, mode: 'insensitive' },
            },
          },
        ],
      }
    : {}

  const orderBy: Prisma.DepartmentOrderByWithRelationInput =
    safeSortBy === 'company'
      ? { company: { tradeName: safeSortOrder } }
      : { name: safeSortOrder }

  const [departments, totalCount] = await Promise.all([
    prisma.department.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { company: { select: { tradeName: true } } },
    }),
    prisma.department.count({ where }),
  ])

  return {
    departments,
    totalCount,
    pageSize: PAGE_SIZE,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  }
}

export type DepartmentListItem = Awaited<
  ReturnType<typeof getDepartments>
>['departments'][number]
