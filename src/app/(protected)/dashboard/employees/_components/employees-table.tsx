import { cn } from '@/app/_lib/utils'
import { maskCPF, maskPhone } from '@/app/_utils/masks'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
  EmployeeStatusFilter,
} from '@/app/(protected)/_actions/employees/get-employees'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

import {
  EMPLOYEE_STATUS_BADGE_CLASSNAME,
  EMPLOYEE_STATUS_LABEL,
} from '../_lib/employee-status'
import EmployeeStatusDialog from './employee-status-dialog'

type EmployeesTableProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
  status: EmployeeStatusFilter
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: () => void
}

const STATUS_COLUMN: DataTableColumn<EmployeeListItem, EmployeeSortField> = {
  label: 'Status',
  field: 'status',
  render: (employee) => (
    <span
      className={cn(
        'rounded-full px-2.25 py-0.75 text-xs font-semibold',
        EMPLOYEE_STATUS_BADGE_CLASSNAME[employee.status],
      )}
    >
      {EMPLOYEE_STATUS_LABEL[employee.status]}
    </span>
  ),
}

const BASE_COLUMNS: DataTableColumn<EmployeeListItem, EmployeeSortField>[] = [
  {
    label: 'Nome',
    field: 'firstName',
    render: (employee) => (
      <span className='font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        {employee.firstName} {employee.lastName}
      </span>
    ),
  },
  {
    label: 'CPF',
    field: 'cpf',
    render: (employee) => maskCPF(employee.cpf),
  },
  {
    label: 'Email',
    field: 'email',
    render: (employee) => (
      <span className='text-[#121d22] dark:text-[#f1f5f9]'>
        {employee.email}
      </span>
    ),
  },
  {
    label: 'Telefone',
    field: 'phone',
    render: (employee) => maskPhone(employee.phone),
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
    label: 'Departamento',
    field: 'department',
    render: (employee) => employee.department.departmentType.name,
  },
]

const EmployeesTable = ({
  employees,
  query,
  sortBy,
  sortOrder,
  status,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: EmployeesTableProps) => {
  const columns =
    status === 'active' ? BASE_COLUMNS : [...BASE_COLUMNS, STATUS_COLUMN]

  return (
    <DataTable
      items={employees}
      columns={columns}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhum funcionário encontrado.'
      entityLabel='funcionário'
      editHref={(employee) => `/dashboard/employees/${employee.id}/edit`}
      deleteAction={(employee) => <EmployeeStatusDialog employee={employee} />}
      extraParams={status !== 'active' ? { status } : undefined}
      selectedIds={selectedIds}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
    />
  )
}

export default EmployeesTable
