import { cn } from '@/app/_lib/utils'
import { maskCEP, maskCNPJ, maskPhone } from '@/app/_utils/masks'
import type {
  CompanyListItem,
  CompanySortField,
  CompanySortOrder,
  CompanyStatusFilter,
} from '@/app/(protected)/_actions/companies/get-companies'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

import DeleteCompanyDialog from './delete-company-dialog'
import ReactivateCompanyButton from './reactivate-company-button'

type CompaniesTableProps = {
  companies: CompanyListItem[]
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
  status: CompanyStatusFilter
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: () => void
}

const STATUS_COLUMN: DataTableColumn<CompanyListItem, CompanySortField> = {
  label: 'Status',
  field: 'active',
  render: (company) => (
    <span
      className={cn(
        'rounded-full px-2.25 py-0.75 text-xs font-semibold',
        company.active
          ? 'bg-[#e3f5e9] text-[#15803d]'
          : 'bg-[#f1f2f4] text-[#6b7280]',
      )}
    >
      {company.active ? 'Ativa' : 'Inativa'}
    </span>
  ),
}

const BASE_COLUMNS: DataTableColumn<CompanyListItem, CompanySortField>[] = [
  {
    label: 'Nome - Razão Social',
    field: 'tradeName',
    render: (company) => (
      <span className='font-semibold text-[#121d22]'>{company.tradeName}</span>
    ),
  },
  {
    label: 'CNPJ',
    field: 'cnpj',
    render: (company) => maskCNPJ(company.cnpj),
  },
  {
    label: 'Email',
    field: 'email',
    render: (company) => (
      <span className='text-[#121d22]'>{company.email}</span>
    ),
  },
  {
    label: 'Site',
    field: 'website',
    render: (company) => (
      <span className='text-[#003d9b]'>{company.website ?? '-'}</span>
    ),
  },
  {
    label: 'Telefone Fixo',
    field: 'landlinePhone',
    render: (company) => maskPhone(company.landlinePhone),
  },
  {
    label: 'Telefone Celular',
    field: 'mobilePhone',
    render: (company) =>
      company.mobilePhone ? maskPhone(company.mobilePhone) : '-',
  },
  {
    label: 'CEP',
    field: 'postalCode',
    render: (company) =>
      company.postalCode ? maskCEP(company.postalCode) : '-',
  },
]

const CompaniesTable = ({
  companies,
  query,
  sortBy,
  sortOrder,
  status,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: CompaniesTableProps) => {
  const columns =
    status === 'active' ? BASE_COLUMNS : [...BASE_COLUMNS, STATUS_COLUMN]

  return (
    <DataTable
      items={companies}
      columns={columns}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhuma empresa encontrada.'
      entityLabel='empresa'
      editHref={(company) => `/dashboard/companies/${company.id}/edit`}
      deleteAction={(company) =>
        company.active ? (
          <DeleteCompanyDialog company={company} />
        ) : (
          <ReactivateCompanyButton companyId={company.id} />
        )
      }
      extraParams={status !== 'active' ? { status } : undefined}
      selectedIds={selectedIds}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
    />
  )
}

export default CompaniesTable
