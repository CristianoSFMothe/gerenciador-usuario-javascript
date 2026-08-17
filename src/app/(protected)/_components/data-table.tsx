import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Checkbox } from '@/app/_components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { cn } from '@/app/_lib/utils'

export type DataTableColumn<TItem, TField extends string> = {
  label: string
  field: TField
  render: (item: TItem) => ReactNode
}

type SortOrder = 'asc' | 'desc'

type DataTableProps<TItem extends { id: string }, TField extends string> = {
  items: TItem[]
  columns: DataTableColumn<TItem, TField>[]
  query?: string
  sortBy: TField
  sortOrder: SortOrder
  emptyMessage: string
  entityLabel: string
  editHref?: (item: TItem) => string
  deleteAction?: (item: TItem) => ReactNode
  actions?: (item: TItem) => ReactNode
  extraParams?: Record<string, string>
  selectedIds?: Set<string>
  onToggleRow?: (id: string) => void
  onToggleAll?: () => void
}

const buildSortHref = (
  field: string,
  nextOrder: SortOrder,
  query?: string,
  extraParams?: Record<string, string>,
) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  params.set('sortBy', field)
  params.set('sortOrder', nextOrder)
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
  }

  return `?${params.toString()}`
}

type SortableTableHeadProps<TField extends string> = {
  label: string
  field: TField
  query?: string
  currentSortBy: TField
  currentSortOrder: SortOrder
  extraParams?: Record<string, string>
}

const SortableTableHead = <TField extends string>({
  label,
  field,
  query,
  currentSortBy,
  currentSortOrder,
  extraParams,
}: SortableTableHeadProps<TField>) => {
  const isActive = field === currentSortBy
  const nextOrder: SortOrder =
    isActive && currentSortOrder === 'asc' ? 'desc' : 'asc'

  const Icon = isActive
    ? currentSortOrder === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown

  return (
    <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
      <Link
        href={buildSortHref(field, nextOrder, query, extraParams)}
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

const DataTable = <TItem extends { id: string }, TField extends string>({
  items,
  columns,
  query,
  sortBy,
  sortOrder,
  emptyMessage,
  entityLabel,
  editHref,
  deleteAction,
  actions,
  extraParams,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: DataTableProps<TItem, TField>) => {
  const selectable = Boolean(onToggleRow && onToggleAll)
  const allSelected =
    selectable &&
    items.length > 0 &&
    items.every((item) => selectedIds?.has(item.id))
  const someSelected =
    selectable &&
    !allSelected &&
    items.some((item) => selectedIds?.has(item.id))

  if (items.length === 0) {
    return (
      <div className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654]'>
        {emptyMessage}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa]'>
          {selectable && (
            <TableHead className='h-auto w-10 p-4'>
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? 'indeterminate' : false
                }
                onCheckedChange={onToggleAll}
                aria-label='Selecionar todos'
              />
            </TableHead>
          )}
          {columns.map((column) => (
            <SortableTableHead
              key={column.field}
              label={column.label}
              field={column.field}
              query={query}
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              extraParams={extraParams}
            />
          ))}
          <TableHead className='h-auto p-4 text-right text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} className='border-[#dfe1e6]'>
            {selectable && (
              <TableCell className='w-10 p-4'>
                <Checkbox
                  checked={selectedIds?.has(item.id) ?? false}
                  onCheckedChange={() => onToggleRow?.(item.id)}
                  aria-label='Selecionar linha'
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.field}
                className='p-4 text-sm text-[#434654]'
              >
                {column.render(item)}
              </TableCell>
            ))}
            <TableCell className='p-4 text-right'>
              <div className='flex items-center justify-end gap-2'>
                {actions ? (
                  actions(item)
                ) : (
                  <>
                    {editHref ? (
                      <Link
                        href={editHref(item)}
                        title={`Editar ${entityLabel}`}
                        aria-label={`Editar ${entityLabel}`}
                        className='p-1 text-[#434654] hover:text-[#003d9b]'
                      >
                        <Pencil className='size-3.5' />
                      </Link>
                    ) : (
                      <button
                        type='button'
                        disabled
                        title={`Editar ${entityLabel} (em breve)`}
                        aria-label={`Editar ${entityLabel}`}
                        className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                      >
                        <Pencil className='size-3.5' />
                      </button>
                    )}
                    {deleteAction ? (
                      deleteAction(item)
                    ) : (
                      <button
                        type='button'
                        disabled
                        title={`Excluir ${entityLabel} (em breve)`}
                        aria-label={`Excluir ${entityLabel}`}
                        className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                      >
                        <Trash2 className='size-3.5' />
                      </button>
                    )}
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable
