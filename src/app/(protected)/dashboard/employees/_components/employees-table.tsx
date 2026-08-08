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
import { maskCPF, maskPhone } from '@/app/_utils/masks'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
} from '@/app/(protected)/_actions/employees/get-employees'

type EmployeesTableProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
}

type SortableColumn = {
  label: string
  field: EmployeeSortField
}

const SORTABLE_COLUMNS: SortableColumn[] = [
  { label: 'Nome', field: 'firstName' },
  { label: 'CPF', field: 'cpf' },
  { label: 'Email', field: 'email' },
  { label: 'Telefone', field: 'phone' },
  { label: 'Empresa', field: 'company' },
  { label: 'Cargo', field: 'position' },
  { label: 'Departamento', field: 'department' },
  { label: 'Status', field: 'status' },
]

const STATUS_LABEL: Record<EmployeeListItem['status'], string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

const buildSortHref = (
  field: EmployeeSortField,
  nextOrder: EmployeeSortOrder,
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
  currentSortBy: EmployeeSortField
  currentSortOrder: EmployeeSortOrder
}

const SortableTableHead = ({
  label,
  field,
  query,
  currentSortBy,
  currentSortOrder,
}: SortableTableHeadProps) => {
  const isActive = field === currentSortBy
  const nextOrder: EmployeeSortOrder =
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

const EmployeesTable = ({
  employees,
  query,
  sortBy,
  sortOrder,
}: EmployeesTableProps) => {
  if (employees.length === 0) {
    return (
      <div className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654]'>
        Nenhum funcionário encontrado.
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
        {employees.map((employee) => (
          <TableRow key={employee.id} className='border-[#dfe1e6]'>
            <TableCell className='p-4 text-sm font-semibold text-[#121d22]'>
              {employee.firstName} {employee.lastName}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskCPF(employee.cpf)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#121d22]'>
              {employee.email}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskPhone(employee.phone)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {employee.company.tradeName}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {employee.position.title}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {employee.department.name}
            </TableCell>
            <TableCell className='p-4 text-sm'>
              <span
                className={cn(
                  'rounded-full px-2.25 py-0.75 text-xs font-semibold',
                  employee.status === 'ACTIVE'
                    ? 'bg-[#e3f5e9] text-[#15803d]'
                    : 'bg-[#f1f2f4] text-[#6b7280]',
                )}
              >
                {STATUS_LABEL[employee.status]}
              </span>
            </TableCell>
            <TableCell className='p-4 text-right'>
              <div className='flex items-center justify-end gap-2'>
                <button
                  type='button'
                  disabled
                  title='Editar funcionário (em breve)'
                  aria-label='Editar funcionário'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Pencil className='size-3.5' />
                </button>
                <button
                  type='button'
                  disabled
                  title='Excluir funcionário (em breve)'
                  aria-label='Excluir funcionário'
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

export default EmployeesTable
