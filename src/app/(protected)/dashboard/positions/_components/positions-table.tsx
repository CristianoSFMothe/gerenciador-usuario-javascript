import type {
  PositionListItem,
  PositionSortField,
  PositionSortOrder,
} from '@/app/(protected)/_actions/positions/get-positions'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

type PositionsTableProps = {
  positions: PositionListItem[]
  query?: string
  sortBy: PositionSortField
  sortOrder: PositionSortOrder
}

const COLUMNS: DataTableColumn<PositionListItem, PositionSortField>[] = [
  {
    label: 'Cargo',
    field: 'title',
    render: (position) => (
      <span className='font-semibold text-[#121d22]'>{position.title}</span>
    ),
  },
  {
    label: 'Empresa',
    field: 'company',
    render: (position) => position.company.tradeName,
  },
]

const PositionsTable = ({
  positions,
  query,
  sortBy,
  sortOrder,
}: PositionsTableProps) => {
  return (
    <DataTable
      items={positions}
      columns={COLUMNS}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhum cargo encontrado.'
      entityLabel='cargo'
    />
  )
}

export default PositionsTable
