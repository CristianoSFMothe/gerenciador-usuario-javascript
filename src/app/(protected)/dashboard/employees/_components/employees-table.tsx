import { cn } from '@/app/_lib/utils'
import { maskCPF, maskPhone } from '@/app/_utils/masks'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
} from '@/app/(protected)/_actions/employees/get-employees'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

type EmployeesTableProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
}

const STATUS_LABEL: Record<EmployeeListItem['status'], string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

const COLUMNS: DataTableColumn<EmployeeListItem, EmployeeSortField>[] = [
  {
    label: 'Nome',
    field: 'firstName',
    render: (employee) => (
      <span className='font-semibold text-[#121d22]'>
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
      <span className='text-[#121d22]'>{employee.email}</span>
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
  {
    label: 'Status',
    field: 'status',
    render: (employee) => (
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
    ),
  },
]

const EmployeesTable = ({
  employees,
  query,
  sortBy,
  sortOrder,
}: EmployeesTableProps) => {
  return (
    <DataTable
      items={employees}
      columns={COLUMNS}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhum funcionário encontrado.'
      entityLabel='funcionário'
      editHref={(employee) => `/dashboard/employees/${employee.id}/edit`}
    />
  )
}

export default EmployeesTable
