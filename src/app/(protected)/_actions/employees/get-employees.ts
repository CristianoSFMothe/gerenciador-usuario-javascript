import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export type EmployeeSortField =
  | 'firstName'
  | 'cpf'
  | 'email'
  | 'phone'
  | 'company'
  | 'position'
  | 'department'
  | 'status'

export type EmployeeSortOrder = 'asc' | 'desc'

const SORTABLE_FIELDS: EmployeeSortField[] = [
  'firstName',
  'cpf',
  'email',
  'phone',
  'company',
  'position',
  'department',
  'status',
]

const isSortableField = (value: string): value is EmployeeSortField =>
  SORTABLE_FIELDS.includes(value as EmployeeSortField)

type GetEmployeesParams = {
  query?: string
  page?: number
  sortBy?: string
  sortOrder?: string
}

export const getEmployees = async ({
  query = '',
  page = 1,
  sortBy,
  sortOrder,
}: GetEmployeesParams) => {
  const trimmedQuery = query.trim()
  const queryDigits = onlyDigits(trimmedQuery)

  const safeSortBy: EmployeeSortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'firstName'
  const safeSortOrder: EmployeeSortOrder = sortOrder === 'desc' ? 'desc' : 'asc'

  const where: Prisma.EmployeeWhereInput = trimmedQuery
    ? {
        OR: [
          { firstName: { contains: trimmedQuery, mode: 'insensitive' } },
          { lastName: { contains: trimmedQuery, mode: 'insensitive' } },
          { email: { contains: trimmedQuery, mode: 'insensitive' } },
          ...(queryDigits ? [{ cpf: { contains: queryDigits } }] : []),
          {
            company: {
              tradeName: { contains: trimmedQuery, mode: 'insensitive' },
            },
          },
        ],
      }
    : {}

  const orderBy: Prisma.EmployeeOrderByWithRelationInput = (() => {
    switch (safeSortBy) {
      case 'company':
        return { company: { tradeName: safeSortOrder } }
      case 'position':
        return { position: { title: safeSortOrder } }
      case 'department':
        return { department: { name: safeSortOrder } }
      default:
        return { [safeSortBy]: safeSortOrder }
    }
  })()

  const [employees, totalCount] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        company: { select: { tradeName: true } },
        position: { select: { title: true } },
        department: { select: { name: true } },
      },
    }),
    prisma.employee.count({ where }),
  ])

  return {
    employees,
    totalCount,
    pageSize: PAGE_SIZE,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  }
}

export type EmployeeListItem = Awaited<
  ReturnType<typeof getEmployees>
>['employees'][number]
