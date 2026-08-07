import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { cn } from '@/app/_lib/utils'
import type {
  PositionListItem,
  PositionSortField,
  PositionSortOrder,
} from '@/app/(protected)/_actions/positions/get-positions'

type PositionsTableProps = {
  positions: PositionListItem[]
  query?: string
  sortBy: PositionSortField
  sortOrder: PositionSortOrder
}

type SortableColumn = {
  label: string
  field: PositionSortField
}

const SORTABLE_COLUMNS: SortableColumn[] = [
  { label: 'Cargo', field: 'title' },
  { label: 'Empresa', field: 'company' },
]

const buildSortHref = (
  field: PositionSortField,
  nextOrder: PositionSortOrder,
  query?: string,
) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', field)
  params.set('sortOrder', nextOrder)

  return `?${params.toString()}`
}

type SortableTableHeadProps = SortableColumn & {
  query?: string
  currentSortBy: PositionSortField
  currentSortOrder: PositionSortOrder
}

const SortableTableHead = ({
  label,
  field,
  query,
  currentSortBy,
  currentSortOrder,
}: SortableTableHeadProps) => {
  const isActive = field === currentSortBy
  const nextOrder: PositionSortOrder =
    isActive && currentSortOrder === 'asc' ? 'desc' : 'asc'

  const Icon = isActive
    ? currentSortOrder === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown

  return (
    <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
      <Link
        href={buildSortHref(field, nextOrder, query)}
        className={cn(
          'inline-flex items-center gap-1 hover:text-[#003d9b]',
          isActive && 'text-[#003d9b]',
        )}
      >
        {label}
        <Icon className='size-3' />
      </Link>
    </TableHead>
  )
}

const PositionsTable = ({
  positions,
  query,
  sortBy,
  sortOrder,
}: PositionsTableProps) => {
  if (positions.length === 0) {
    return (
      <div className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654]'>
        Nenhum cargo encontrado.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa]'>
          {SORTABLE_COLUMNS.map((column) => (
            <SortableTableHead
              key={column.field}
              {...column}
              query={query}
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
            />
          ))}
          <TableHead className='h-auto p-4 text-right text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.id} className='border-[#dfe1e6]'>
            <TableCell className='p-4 text-sm font-semibold text-[#121d22]'>
              {position.title}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {position.company.tradeName}
            </TableCell>
            <TableCell className='p-4 text-right'>
              <div className='flex items-center justify-end gap-2'>
                <button
                  type='button'
                  disabled
                  title='Editar cargo (em breve)'
                  aria-label='Editar cargo'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Pencil className='size-3.5' />
                </button>
                <button
                  type='button'
                  disabled
                  title='Excluir cargo (em breve)'
                  aria-label='Excluir cargo'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Trash2 className='size-3.5' />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PositionsTable
