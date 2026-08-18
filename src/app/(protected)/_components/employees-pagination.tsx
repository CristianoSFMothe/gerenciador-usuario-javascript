import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/_components/ui/pagination'
import { cn } from '@/app/_lib/utils'
import type {
  EmployeeSortField,
  EmployeeSortOrder,
} from '@/app/(protected)/_actions/employees/get-employees'

type EmployeesPaginationProps = {
  currentPage: number
  totalCount: number
  pageSize: number
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
}

const ELLIPSIS = 'ellipsis' as const

const buildPageHref = (
  page: number,
  query: string | undefined,
  sortBy: EmployeeSortField,
  sortOrder: EmployeeSortOrder,
) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', sortBy)
  params.set('sortOrder', sortOrder)
  if (page > 1) params.set('page', String(page))

  const search = params.toString()

  return search ? `?${search}` : '?'
}

const buildPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages, currentPage])

  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)

  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  const withEllipsis: (number | typeof ELLIPSIS)[] = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage !== undefined && page - previousPage > 1) {
      withEllipsis.push(ELLIPSIS)
    }

    withEllipsis.push(page)
  })

  return withEllipsis
}

const EmployeesPagination = ({
  currentPage,
  totalCount,
  pageSize,
  query,
  sortBy,
  sortOrder,
}: EmployeesPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const pageNumbers = buildPageNumbers(currentPage, totalPages)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className='flex items-center justify-between border-t border-[#dfe1e6] px-4 py-4 dark:border-[#1e293b]'>
      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem
            className={hasPreviousPage ? undefined : 'cursor-not-allowed'}
          >
            <PaginationPrevious
              href={buildPageHref(
                Math.max(currentPage - 1, 1),
                query,
                sortBy,
                sortOrder,
              )}
              aria-disabled={!hasPreviousPage}
              tabIndex={hasPreviousPage ? undefined : -1}
              className={
                hasPreviousPage
                  ? 'cursor-pointer'
                  : 'pointer-events-none opacity-50'
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === ELLIPSIS ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href={buildPageHref(page, query, sortBy, sortOrder)}
                  isActive={page === currentPage}
                  className={cn(
                    'cursor-pointer',
                    page === currentPage
                      ? 'border-[#003d9b]/20 bg-[#003d9b]/10 text-[#003d9b] hover:bg-[#003d9b]/10 hover:text-[#003d9b] dark:border-[#60a5fa]/30 dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] dark:hover:bg-[#60a5fa]/10 dark:hover:text-[#60a5fa]'
                      : 'text-[#434654] hover:bg-[#003d9b]/5 dark:text-[#94a3b8] dark:hover:bg-[#60a5fa]/10',
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem
            className={hasNextPage ? undefined : 'cursor-not-allowed'}
          >
            <PaginationNext
              href={buildPageHref(
                Math.min(currentPage + 1, totalPages),
                query,
                sortBy,
                sortOrder,
              )}
              aria-disabled={!hasNextPage}
              tabIndex={hasNextPage ? undefined : -1}
              className={
                hasNextPage
                  ? 'cursor-pointer'
                  : 'pointer-events-none opacity-50'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default EmployeesPagination
