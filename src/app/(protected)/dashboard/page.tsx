import {
  AlertCircle,
  Plus,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'
import { getDashboardMetrics } from '@/app/(protected)/_actions/dashboard/get-dashboard-metrics'
import { getEmployees } from '@/app/(protected)/_actions/employees/get-employees'
import EmployeesPagination from '@/app/(protected)/_components/employees-pagination'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import DashboardEmployeesTable from './_components/dashboard-employees-table'
import DashboardExportButton from './_components/dashboard-export-button'
import DashboardStatCard from './_components/dashboard-stat-card'
import UserGrowthChart from './_components/user-growth-chart'
import UsersByDepartmentChart from './_components/users-by-department-chart'

type DashboardPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    sortBy?: string
    sortOrder?: string
  }>
}

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
  const { q, page, sortBy, sortOrder } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const [metrics, employeesResult] = await Promise.all([
    getDashboardMetrics(),
    getEmployees({
      query: q,
      page: currentPage,
      sortBy,
      sortOrder,
      status: 'all',
    }),
  ])

  const {
    employees,
    totalCount,
    pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  } = employeesResult

  const isPositiveGrowth = metrics.growthPercent >= 0
  const GrowthIcon = isPositiveGrowth ? TrendingUp : TrendingDown

  return (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1
            data-testid='dashboard-title'
            className='text-[28px] font-semibold tracking-tight text-[#121d22] dark:text-[#f1f5f9]'
          >
            Dashboard
          </h1>
          <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
            Visão geral do sistema e métricas principais.
          </p>
        </div>

        <div className='flex gap-2 print:hidden'>
          <DashboardExportButton />
          <Button
            asChild
            className='bg-[#003d9b] text-xs text-white hover:bg-[#003d9b]/90'
          >
            <Link
              href='/dashboard/employees/new-employee'
              data-testid='dashboard-new-employee-link'
            >
              <Plus className='size-3.5' />
              Novo Usuário
            </Link>
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <DashboardStatCard
          testId='dashboard-stat-total-users'
          title='Total de Usuários'
          value={metrics.totalEmployees}
          icon={Users}
          tone='blue'
          footer={
            <span className='mb-1 inline-flex items-center gap-1 rounded-sm bg-[#00a65a]/10 px-1 py-0.5 text-xs font-semibold text-[#00a65a]'>
              <GrowthIcon className='size-3' />
              {isPositiveGrowth ? '+' : ''}
              {metrics.growthPercent}%
            </span>
          }
        />
        <DashboardStatCard
          testId='dashboard-stat-active-users'
          title='Usuários Ativos'
          value={metrics.activeEmployees}
          icon={UserCheck}
          tone='green'
          footer={
            <span className='mb-1 text-xs text-[#434654] dark:text-[#94a3b8]'>
              vs mês anterior
            </span>
          }
        />
        <DashboardStatCard
          testId='dashboard-stat-inactive-users'
          title='Usuários Desativados'
          value={metrics.inactiveEmployees}
          icon={AlertCircle}
          tone='red'
          footer={
            <span className='mb-1 inline-flex items-center gap-1 rounded-sm bg-[#d93025]/10 px-1 py-0.5 text-xs font-semibold text-[#d93025]'>
              Atenção
            </span>
          }
        />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
          <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
            Crescimento de Usuários
          </h2>
          <UserGrowthChart data={metrics.userGrowth} />
        </div>
        <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
          <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
            Usuários por Setor
          </h2>
          <UsersByDepartmentChart data={metrics.departmentBreakdown} />
        </div>
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white dark:border-[#1e293b] dark:bg-[#0f172a]'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4 dark:border-[#1e293b]'>
          <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
            Lista de Usuários
          </h2>
          <div className='print:hidden'>
            <ListSearchInput
              testId='dashboard-search-input'
              defaultValue={q ?? ''}
              placeholder='Buscar usuário...'
            />
          </div>
        </div>

        <DashboardEmployeesTable
          employees={employees}
          query={q}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
        />

        <div className='print:hidden'>
          <EmployeesPagination
            testId='dashboard-pagination'
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            query={q}
            sortBy={currentSortBy}
            sortOrder={currentSortOrder}
            status='all'
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
