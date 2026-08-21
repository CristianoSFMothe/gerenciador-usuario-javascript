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
  // Base para os data-testid das linhas/células; sem ele a tabela não expõe nenhum.
  testId?: string
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
    <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
      <Link
        href={buildSortHref(field, nextOrder, query, extraParams)}
        className={cn(
          'inline-flex items-center gap-1 hover:text-[#003d9b] dark:hover:text-[#60a5fa]',
          isActive && 'text-[#003d9b] dark:text-[#60a5fa]',
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
  testId,
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
      <div
        data-testid={testId ? `${testId}-empty` : undefined}
        className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654] dark:text-[#94a3b8]'
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <Table data-testid={testId}>
      <TableHeader>
        <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa] dark:border-[#1e293b] dark:bg-[#1e293b] dark:hover:bg-[#1e293b]'>
          {selectable && (
            <TableHead className='h-auto w-10 p-4'>
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? 'indeterminate' : false
                }
                onCheckedChange={onToggleAll}
                aria-label='Selecionar todos'
                data-testid={
                  testId ? `${testId}-select-all-checkbox` : undefined
                }
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
          <TableHead className='h-auto p-4 text-right text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            data-testid={testId ? `${testId}-row-${item.id}` : undefined}
            className='border-[#dfe1e6] dark:border-[#1e293b]'
          >
            {selectable && (
              <TableCell className='w-10 p-4'>
                <Checkbox
                  checked={selectedIds?.has(item.id) ?? false}
                  onCheckedChange={() => onToggleRow?.(item.id)}
                  aria-label='Selecionar linha'
                  data-testid={
                    testId ? `${testId}-row-${item.id}-checkbox` : undefined
                  }
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.field}
                data-testid={
                  testId ? `${testId}-cell-${column.field}` : undefined
                }
                className='p-4 text-sm text-[#434654] dark:text-[#94a3b8]'
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
                        data-testid={
                          testId ? `${testId}-row-${item.id}-edit` : undefined
                        }
                        className='p-1 text-[#434654] hover:text-[#003d9b] dark:text-[#94a3b8] dark:hover:text-[#60a5fa]'
                      >
                        <Pencil className='size-3.5' />
                      </Link>
                    ) : (
                      <button
                        type='button'
                        disabled
                        title={`Editar ${entityLabel} (em breve)`}
                        aria-label={`Editar ${entityLabel}`}
                        className='cursor-not-allowed p-1 text-[#434654] opacity-50 dark:text-[#94a3b8]'
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
                        className='cursor-not-allowed p-1 text-[#434654] opacity-50 dark:text-[#94a3b8]'
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
