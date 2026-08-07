import { prisma } from '@/app/_lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export type PositionSortField = 'title' | 'company'
export type PositionSortOrder = 'asc' | 'desc'

const SORTABLE_FIELDS: PositionSortField[] = ['title', 'company']

const isSortableField = (value: string): value is PositionSortField =>
  SORTABLE_FIELDS.includes(value as PositionSortField)

type GetPositionsParams = {
  query?: string
  page?: number
  sortBy?: string
  sortOrder?: string
}

export const getPositions = async ({
  query = '',
  page = 1,
  sortBy,
  sortOrder,
}: GetPositionsParams) => {
  const trimmedQuery = query.trim()

  const safeSortBy: PositionSortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'title'
  const safeSortOrder: PositionSortOrder = sortOrder === 'desc' ? 'desc' : 'asc'

  const where: Prisma.PositionWhereInput = trimmedQuery
    ? {
        OR: [
          { title: { contains: trimmedQuery, mode: 'insensitive' } },
          {
            company: {
              tradeName: { contains: trimmedQuery, mode: 'insensitive' },
            },
          },
        ],
      }
    : {}

  const orderBy: Prisma.PositionOrderByWithRelationInput =
    safeSortBy === 'company'
      ? { company: { tradeName: safeSortOrder } }
      : { title: safeSortOrder }

  const [positions, totalCount] = await Promise.all([
    prisma.position.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { company: { select: { tradeName: true } } },
    }),
    prisma.position.count({ where }),
  ])

  return {
    positions,
    totalCount,
    pageSize: PAGE_SIZE,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  }
}

export type PositionListItem = Awaited<
  ReturnType<typeof getPositions>
>['positions'][number]
