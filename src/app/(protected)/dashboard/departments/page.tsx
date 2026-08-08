import { Download, Filter } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { getDepartments } from '@/app/(protected)/_actions/departments/get-departments'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import DepartmentsPagination from './_components/departments-pagination'
import DepartmentsTable from './_components/departments-table'

type DepartmentsPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
  }>
}

const Departments = async ({ searchParams }: DepartmentsPageProps) => {
  const { q, page, sortBy, sortOrder } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const {
    departments,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  } = await getDepartments({
    query: q,
    page: currentPage,
    sortBy,
    sortOrder,
  })

  return (
    <div className='flex flex-col gap-8 p-8'>
      <ListPageHeader
        title='Listagem de Departamentos'
        description='Gerencie os departamentos disponíveis em cada empresa cadastrada.'
        actionLabel='Novo Departamento'
        actionHref='/dashboard/departments/new-department'
      />

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <ListSearchInput
            defaultValue={q ?? ''}
            placeholder='Buscar departamento por nome ou empresa...'
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

        <DepartmentsTable
          departments={departments}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
        />

        <DepartmentsPagination
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

export default Departments
