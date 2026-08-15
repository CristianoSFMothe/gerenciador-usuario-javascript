import { maskCEP, maskCNPJ, maskPhone } from '@/app/_utils/masks'
import type {
  CompanyListItem,
  CompanySortField,
  CompanySortOrder,
} from '@/app/(protected)/_actions/companies/get-companies'
import DataTable, {
  type DataTableColumn,
} from '@/app/(protected)/_components/data-table'

import DeleteCompanyDialog from './delete-company-dialog'

type CompaniesTableProps = {
  companies: CompanyListItem[]
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
}

const COLUMNS: DataTableColumn<CompanyListItem, CompanySortField>[] = [
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
}: CompaniesTableProps) => {
  return (
    <DataTable
      items={companies}
      columns={COLUMNS}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyMessage='Nenhuma empresa encontrada.'
      entityLabel='empresa'
      editHref={(company) => `/dashboard/companies/${company.id}/edit`}
      deleteAction={(company) => <DeleteCompanyDialog company={company} />}
    />
  )
}

export default CompaniesTable
