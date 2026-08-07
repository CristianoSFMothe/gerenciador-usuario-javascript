import { Download, Filter, Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'
import { getCompanies } from '@/app/(protected)/_actions/companies/get-companies'

import CompaniesPagination from './_components/companies-pagination'
import CompaniesTable from './_components/companies-table'
import CompanySearchInput from './_components/company-search-input'

type CompaniesPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

const Companies = async ({ searchParams }: CompaniesPageProps) => {
  const { q, page } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const { companies, totalCount, pageSize } = await getCompanies({
    query: q,
    page: currentPage,
  })

  return (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-[28px] font-semibold tracking-tight text-[#121d22]'>
            Listagem de Empresas
          </h1>
          <p className='text-sm text-[#434654]'>
            Gerencie o cadastro de empresas parceiras e clientes.
          </p>
        </div>

        <Button asChild className='bg-[#003d9b] text-xs hover:bg-[#003d9b]/90'>
          <Link href='/dashboard/companies/new-company'>
            <Plus className='size-3.5' />
            Nova Empresa
          </Link>
        </Button>
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <CompanySearchInput defaultValue={q ?? ''} />

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

        <CompaniesTable companies={companies} />

        <CompaniesPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          query={q}
        />
      </div>
    </div>
  )
}

export default Companies
