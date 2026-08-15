import { Download, Filter } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { getEmployees } from '@/app/(protected)/_actions/employees/get-employees'
import EmployeesPagination from '@/app/(protected)/_components/employees-pagination'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import EmployeesTable from './_components/employees-table'

type EmployeesPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
  }>
}

const Employees = async ({ searchParams }: EmployeesPageProps) => {
  const { q, page, sortBy, sortOrder } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const {
    employees,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  } = await getEmployees({
    query: q,
    page: currentPage,
    sortBy,
    sortOrder,
  })

  return (
    <div className='flex flex-col gap-8 p-8'>
      <ListPageHeader
        title='Listagem de Funcionários'
        description='Gerencie o cadastro de funcionários das empresas.'
        actionLabel='Novo Funcionário'
        actionHref='/dashboard/employees/new-employee'
      />

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <ListSearchInput
            defaultValue={q ?? ''}
            placeholder='Buscar funcionário por nome, CPF ou empresa...'
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

        <EmployeesTable
          employees={employees}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
        />

        <EmployeesPagination
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

export default Employees
