import type {
  DepartmentListItem,
  DepartmentSortField,
  DepartmentSortOrder,
} from '@/app/(protected)/_actions/departments/get-departments'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

type DepartmentsTableProps = {
  departments: DepartmentListItem[]
  query?: string
  sortBy: DepartmentSortField
  sortOrder: DepartmentSortOrder
}

const COLUMNS: DataTableColumn<DepartmentListItem, DepartmentSortField>[] = [
  {
    label: 'Departamento',
    field: 'name',
    render: (department) => (
      <span className='font-semibold text-[#121d22]'>{department.name}</span>
    ),
  },
  {
    label: 'Empresa',
    field: 'company',
    render: (department) => department.company.tradeName,
  },
]

const DepartmentsTable = ({
  departments,
  query,
  sortBy,
  sortOrder,
}: DepartmentsTableProps) => {
  return (
    <DataTable
      items={departments}
      columns={COLUMNS}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhum departamento encontrado.'
      entityLabel='departamento'
    />
  )
}

export default DepartmentsTable
