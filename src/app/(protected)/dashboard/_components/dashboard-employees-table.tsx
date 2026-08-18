import { Eye } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/app/_lib/utils'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
} from '@/app/(protected)/_actions/employees/get-employees'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

type DashboardEmployeesTableProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
}

const STATUS_LABEL: Record<EmployeeListItem['status'], string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Desativado',
}

const COLUMNS: DataTableColumn<EmployeeListItem, EmployeeSortField>[] = [
  {
    label: 'Matrícula',
    field: 'registrationNumber',
    render: (employee) => (
      <span className='font-medium text-[#121d22] dark:text-[#f1f5f9]'>
        #{employee.registrationNumber}
      </span>
    ),
  },
  {
    label: 'Nome',
    field: 'firstName',
    render: (employee) => employee.firstName,
  },
  {
    label: 'Sobrenome',
    field: 'lastName',
    render: (employee) => employee.lastName,
  },
  {
    label: 'Empresa',
    field: 'company',
    render: (employee) => employee.company.tradeName,
  },
  {
    label: 'Cargo',
    field: 'position',
    render: (employee) => employee.position,
  },
  {
    label: 'Setor',
    field: 'department',
    render: (employee) => employee.department.departmentType.name,
  },
  {
    label: 'Status',
    field: 'status',
    render: (employee) => (
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[0.55px] uppercase',
          employee.status === 'ACTIVE'
            ? 'bg-[#00a65a]/10 text-[#00a65a]'
            : 'bg-[#d93025]/10 text-[#d93025]',
        )}
      >
        {STATUS_LABEL[employee.status]}
      </span>
    ),
  },
]

const DashboardEmployeesTable = ({
  employees,
  query,
  sortBy,
  sortOrder,
}: DashboardEmployeesTableProps) => {
  return (
    <DataTable
      items={employees}
      columns={COLUMNS}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhum usuário encontrado.'
      entityLabel='usuário'
      actions={(employee) => (
        <Link
          href={`/dashboard/employees/${employee.id}/edit`}
          title='Visualizar usuário'
          aria-label='Visualizar usuário'
          className='p-1 text-[#434654] hover:text-[#003d9b] dark:text-[#94a3b8] dark:hover:text-[#60a5fa]'
        >
          <Eye className='size-3.5' />
        </Link>
      )}
    />
  )
}

export default DashboardEmployeesTable
