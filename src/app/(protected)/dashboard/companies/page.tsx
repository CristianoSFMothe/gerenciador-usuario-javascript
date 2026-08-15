import { Download } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { getCompanies } from '@/app/(protected)/_actions/companies/get-companies'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import CompaniesPagination from './_components/companies-pagination'
import CompaniesTable from './_components/companies-table'
import CompanyStatusFilter from './_components/company-status-filter'

type CompaniesPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
    status?: string
  }>
}

const Companies = async ({ searchParams }: CompaniesPageProps) => {
  const { q, page, sortBy, sortOrder, status } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const {
    companies,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    status: currentStatus,
  } = await getCompanies({
    query: q,
    page: currentPage,
    sortBy,
    sortOrder,
    status,
  })

  return (
    <div className='flex flex-col gap-8 p-8'>
      <ListPageHeader
        title='Listagem de Empresas'
        description='Gerencie o cadastro de empresas parceiras e clientes.'
        actionLabel='Nova Empresa'
        actionHref='/dashboard/companies/new-company'
      />

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <ListSearchInput
            defaultValue={q ?? ''}
            placeholder='Buscar empresa por nome ou CNPJ...'
          />

          <div className='flex gap-2'>
            <CompanyStatusFilter
              status={currentStatus}
              query={q}
              sortBy={currentSortBy}
              sortOrder={currentSortOrder}
            />
            <Button
              variant='outline'
              disabled
              title='Em breve'
              className='rounded-none border-[#dfe1e6] text-xs text-[#434654]'
            >
              <Download className='size-3.5' />
              Exportar
            </Button>
          </div>
        </div>

        <CompaniesTable
          companies={companies}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
          status={currentStatus}
        />

        <CompaniesPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
          status={currentStatus}
        />
      </div>
    </div>
  )
}

export default Companies
