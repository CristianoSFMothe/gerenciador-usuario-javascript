import { getEmployees } from '@/app/(protected)/_actions/employees/get-employees'
import ListPageHeader from '@/app/(protected)/_components/list-page-header'

import EmployeesListPanel from './_components/employees-list-panel'

type EmployeesPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
    status?: string
  }>
}

const Employees = async ({ searchParams }: EmployeesPageProps) => {
  const { q, page, sortBy, sortOrder, status } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const {
    employees,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    status: currentStatus,
  } = await getEmployees({
    query: q,
    page: currentPage,
    sortBy,
    sortOrder,
    status,
  })

  return (
    <div className='flex flex-col gap-8 p-8'>
      <ListPageHeader
        title='Listagem de Funcionários'
        description='Gerencie o cadastro de funcionários das empresas.'
        actionLabel='Novo Funcionário'
        actionHref='/dashboard/employees/new-employee'
      />

      <EmployeesListPanel
        employees={employees}
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

export default Employees
