import { Download, Filter } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { getCompanies } from '@/app/(protected)/_actions/companies/get-companies'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import CompaniesPagination from './_components/companies-pagination'
import CompaniesTable from './_components/companies-table'

type CompaniesPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
  }>
}

const Companies = async ({ searchParams }: CompaniesPageProps) => {
  const { q, page, sortBy, sortOrder } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const {
    companies,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  } = await getCompanies({
    query: q,
    page: currentPage,
    sortBy,
    sortOrder,
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
            <Button
              variant='outline'
              disabled
              title='Em breve'
              className='rounded-none border-[#dfe1e6] text-xs text-[#434654]'
            >
              <Filter className='size-3.5' />
              Filtros
            </Button>
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
        />

        <CompaniesPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
        />
      </div>
    </div>
  )
}

export default Companies
