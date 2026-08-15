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
  CompanySortField,
  CompanySortOrder,
  CompanyStatusFilter,
} from '@/app/(protected)/_actions/companies/get-companies'

type CompaniesPaginationProps = {
  currentPage: number
  totalCount: number
  pageSize: number
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
  status: CompanyStatusFilter
}

const ELLIPSIS = 'ellipsis' as const

const buildPageHref = (
  page: number,
  query: string | undefined,
  sortBy: CompanySortField,
  sortOrder: CompanySortOrder,
  status: CompanyStatusFilter,
) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', sortBy)
  params.set('sortOrder', sortOrder)
  if (status !== 'active') params.set('status', status)
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

const CompaniesPagination = ({
  currentPage,
  totalCount,
  pageSize,
  query,
  sortBy,
  sortOrder,
  status,
}: CompaniesPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const pageNumbers = buildPageNumbers(currentPage, totalPages)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className='flex items-center justify-between border-t border-[#dfe1e6] px-4 py-4'>
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
                status,
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
                  href={buildPageHref(page, query, sortBy, sortOrder, status)}
                  isActive={page === currentPage}
                  className={cn(
                    'cursor-pointer',
                    page === currentPage
                      ? 'border-[#003d9b]/20 bg-[#003d9b]/10 text-[#003d9b] hover:bg-[#003d9b]/10 hover:text-[#003d9b]'
                      : 'text-[#434654] hover:bg-[#003d9b]/5',
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
                status,
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

export default CompaniesPagination
