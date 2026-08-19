import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import type { Prisma } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export type EmployeeSortField =
  | 'registrationNumber'
  | 'firstName'
  | 'lastName'
  | 'cpf'
  | 'email'
  | 'phone'
  | 'company'
  | 'position'
  | 'department'
  | 'status'

export type EmployeeSortOrder = 'asc' | 'desc'

export type EmployeeStatusFilter = 'active' | 'inactive' | 'all'

const SORTABLE_FIELDS: EmployeeSortField[] = [
  'registrationNumber',
  'firstName',
  'lastName',
  'cpf',
  'email',
  'phone',
  'company',
  'position',
  'department',
  'status',
]

const STATUS_FILTERS: EmployeeStatusFilter[] = ['active', 'inactive', 'all']

const isSortableField = (value: string): value is EmployeeSortField =>
  SORTABLE_FIELDS.includes(value as EmployeeSortField)

const isStatusFilter = (value: string): value is EmployeeStatusFilter =>
  STATUS_FILTERS.includes(value as EmployeeStatusFilter)

const EMPLOYEE_INCLUDE = {
  company: { select: { tradeName: true } },
  department: { select: { departmentType: { select: { name: true } } } },
} satisfies Prisma.EmployeeInclude

type BuildEmployeesQueryParams = {
  query?: string
  sortBy?: string
  sortOrder?: string
  status?: string
}

const buildEmployeesQuery = ({
  query = '',
  sortBy,
  sortOrder,
  status,
}: BuildEmployeesQueryParams) => {
  const trimmedQuery = query.trim()
  const queryDigits = onlyDigits(trimmedQuery)

  const safeSortBy: EmployeeSortField =
    sortBy && isSortableField(sortBy) ? sortBy : 'firstName'
  const safeSortOrder: EmployeeSortOrder = sortOrder === 'desc' ? 'desc' : 'asc'
  const safeStatus: EmployeeStatusFilter =
    status && isStatusFilter(status) ? status : 'active'

  const where: Prisma.EmployeeWhereInput = {
    ...(safeStatus === 'active' && { status: 'ACTIVE' }),
    ...(safeStatus === 'inactive' && { status: 'INACTIVE' }),
    ...(trimmedQuery
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
      : {}),
  }

  const orderBy: Prisma.EmployeeOrderByWithRelationInput = (() => {
    switch (safeSortBy) {
      case 'company':
        return { company: { tradeName: safeSortOrder } }
      case 'position':
        return { position: safeSortOrder }
      case 'department':
        return { department: { departmentType: { name: safeSortOrder } } }
      default:
        return { [safeSortBy]: safeSortOrder }
    }
  })()

  return { where, orderBy, safeSortBy, safeSortOrder, safeStatus }
}

type GetEmployeesParams = BuildEmployeesQueryParams & {
  page?: number
}

export const getEmployees = async ({
  query,
  page = 1,
  sortBy,
  sortOrder,
  status,
}: GetEmployeesParams) => {
  const { where, orderBy, safeSortBy, safeSortOrder, safeStatus } =
    buildEmployeesQuery({ query, sortBy, sortOrder, status })

  const [employees, totalCount] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: EMPLOYEE_INCLUDE,
    }),
    prisma.employee.count({ where }),
  ])

  return {
    employees,
    totalCount,
    pageSize: PAGE_SIZE,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
    status: safeStatus,
  }
}

export type EmployeeListItem = Awaited<
  ReturnType<typeof getEmployees>
>['employees'][number]

type GetEmployeesForExportParams = BuildEmployeesQueryParams & {
  ids?: string[]
}

export const getEmployeesForExport = async ({
  query,
  sortBy,
  sortOrder,
  status,
  ids,
}: GetEmployeesForExportParams) => {
  if (ids && ids.length > 0) {
    return prisma.employee.findMany({
      where: { id: { in: ids } },
      include: EMPLOYEE_INCLUDE,
    })
  }

  const { where, orderBy } = buildEmployeesQuery({
    query,
    sortBy,
    sortOrder,
    status,
  })

  return prisma.employee.findMany({ where, orderBy, include: EMPLOYEE_INCLUDE })
}
