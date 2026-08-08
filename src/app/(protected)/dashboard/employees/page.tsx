import { Download, Filter, Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'
import { getEmployees } from '@/app/(protected)/_actions/employees/get-employees'

import EmployeeSearchInput from './_components/employee-search-input'
import EmployeesPagination from './_components/employees-pagination'
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
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-[28px] font-semibold tracking-tight text-[#121d22]'>
            Listagem de Funcionários
          </h1>
          <p className='text-sm text-[#434654]'>
            Gerencie o cadastro de funcionários das empresas.
          </p>
        </div>

        <Button asChild className='bg-[#003d9b] text-xs hover:bg-[#003d9b]/90'>
          <Link href='/dashboard/employees/new-employee'>
            <Plus className='size-3.5' />
            Novo Funcionário
          </Link>
        </Button>
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <EmployeeSearchInput defaultValue={q ?? ''} />

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
