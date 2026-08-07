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
import { maskCEP, maskCNPJ, maskPhone } from '@/app/_utils/masks'
import type {
  CompanyListItem,
  CompanySortField,
  CompanySortOrder,
} from '@/app/(protected)/_actions/companies/get-companies'

type CompaniesTableProps = {
  companies: CompanyListItem[]
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
}

type SortableColumn = {
  label: string
  field: CompanySortField
}

const SORTABLE_COLUMNS: SortableColumn[] = [
  { label: 'Nome - Razão Social', field: 'tradeName' },
  { label: 'CNPJ', field: 'cnpj' },
  { label: 'Email', field: 'email' },
  { label: 'Site', field: 'website' },
  { label: 'Telefone Fixo', field: 'landlinePhone' },
  { label: 'Telefone Celular', field: 'mobilePhone' },
  { label: 'CEP', field: 'postalCode' },
]

const buildSortHref = (
  field: CompanySortField,
  nextOrder: CompanySortOrder,
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
  currentSortBy: CompanySortField
  currentSortOrder: CompanySortOrder
}

const SortableTableHead = ({
  label,
  field,
  query,
  currentSortBy,
  currentSortOrder,
}: SortableTableHeadProps) => {
  const isActive = field === currentSortBy
  const nextOrder: CompanySortOrder =
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

const CompaniesTable = ({
  companies,
  query,
  sortBy,
  sortOrder,
}: CompaniesTableProps) => {
  if (companies.length === 0) {
    return (
      <div className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654]'>
        Nenhuma empresa encontrada.
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
        {companies.map((company) => (
          <TableRow key={company.id} className='border-[#dfe1e6]'>
            <TableCell className='p-4 text-sm font-semibold text-[#121d22]'>
              {company.tradeName}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskCNPJ(company.cnpj)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#121d22]'>
              {company.email}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#003d9b]'>
              {company.website ?? '-'}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskPhone(company.landlinePhone)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {company.mobilePhone ? maskPhone(company.mobilePhone) : '-'}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {company.postalCode ? maskCEP(company.postalCode) : '-'}
            </TableCell>
            <TableCell className='p-4 text-right'>
              <div className='flex items-center justify-end gap-2'>
                <button
                  type='button'
                  disabled
                  title='Editar empresa (em breve)'
                  aria-label='Editar empresa'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Pencil className='size-3.5' />
                </button>
                <button
                  type='button'
                  disabled
                  title='Excluir empresa (em breve)'
                  aria-label='Excluir empresa'
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

export default CompaniesTable
