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

export type StatusFilterOption<TStatus extends string> = {
  value: TStatus
  label: string
}

type BuildStatusFilterHrefParams<TStatus extends string> = {
  status: TStatus
  defaultStatus: TStatus
  query?: string
  sortBy: string
  sortOrder: string
}

export const buildStatusFilterHref = <TStatus extends string>({
  status,
  defaultStatus,
  query,
  sortBy,
  sortOrder,
}: BuildStatusFilterHrefParams<TStatus>) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', sortBy)
  params.set('sortOrder', sortOrder)
  if (status !== defaultStatus) params.set('status', status)

  const search = params.toString()

  return search ? `?${search}` : '?'
}

type StatusFilterProps<TStatus extends string> = {
  status: TStatus
  options: StatusFilterOption<TStatus>[]
  query?: string
  sortBy: string
  sortOrder: string
  defaultStatus: TStatus
}

const StatusFilter = <TStatus extends string>({
  status,
  options,
  query,
  sortBy,
  sortOrder,
  defaultStatus,
}: StatusFilterProps<TStatus>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'rounded-none border-[#dfe1e6] text-xs text-[#434654] dark:border-[#1e293b] dark:text-[#94a3b8]',
            status !== defaultStatus &&
              'border-[#003d9b]/40 bg-[#003d9b]/5 text-[#003d9b] dark:border-[#60a5fa]/40 dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]',
          )}
        >
          <Filter className='size-3.5' />
          Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {options.map((option) => (
          <DropdownMenuItem key={option.value} asChild>
            <Link
              href={buildStatusFilterHref({
                status: option.value,
                defaultStatus,
                query,
                sortBy,
                sortOrder,
              })}
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

export default StatusFilter
