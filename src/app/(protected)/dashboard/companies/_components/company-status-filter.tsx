import { Filter } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { cn } from '@/app/_lib/utils'
import type {
  CompanySortField,
  CompanySortOrder,
  CompanyStatusFilter as CompanyStatusFilterValue,
} from '@/app/(protected)/_actions/companies/get-companies'

type CompanyStatusFilterProps = {
  status: CompanyStatusFilterValue
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
}

const STATUS_OPTIONS: { value: CompanyStatusFilterValue; label: string }[] = [
  { value: 'active', label: 'Ativas' },
  { value: 'inactive', label: 'Inativas' },
  { value: 'all', label: 'Todas' },
]

const buildStatusHref = (
  status: CompanyStatusFilterValue,
  query: string | undefined,
  sortBy: CompanySortField,
  sortOrder: CompanySortOrder,
) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', sortBy)
  params.set('sortOrder', sortOrder)
  if (status !== 'active') params.set('status', status)

  const search = params.toString()

  return search ? `?${search}` : '?'
}

const CompanyStatusFilter = ({
  status,
  query,
  sortBy,
  sortOrder,
}: CompanyStatusFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'rounded-none border-[#dfe1e6] text-xs text-[#434654] dark:border-[#1e293b] dark:text-[#94a3b8]',
            status !== 'active' &&
              'border-[#003d9b]/40 bg-[#003d9b]/5 text-[#003d9b] dark:border-[#60a5fa]/40 dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]',
          )}
        >
          <Filter className='size-3.5' />
          Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} asChild>
            <Link
              href={buildStatusHref(option.value, query, sortBy, sortOrder)}
              className={cn(
                option.value === status &&
                  'font-semibold text-[#003d9b] dark:text-[#60a5fa]',
              )}
            >
              {option.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CompanyStatusFilter
