import { getCompanies } from '@/app/(protected)/_actions/companies/get-companies'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'

import CompaniesListPanel from './_components/companies-list-panel'

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

      <CompaniesListPanel
        companies={companies}
        query={q}
        sortBy={currentSortBy}
        sortOrder={currentSortOrder}
        status={currentStatus}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  )
}

export default Companies
