import {
  AlertCircle,
  Download,
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
    getEmployees({ query: q, page: currentPage, sortBy, sortOrder }),
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
          <h1 className='text-[28px] font-semibold tracking-tight text-[#121d22]'>
            Dashboard
          </h1>
          <p className='text-sm text-[#434654]'>
            Visão geral do sistema e métricas principais.
          </p>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            disabled
            title='Em breve'
            className='border-[#dfe1e6] bg-[#e4f0f6] text-xs font-semibold text-[#121d22] hover:bg-[#e4f0f6]'
          >
            <Download className='size-3.5' />
            Exportar Relatório
          </Button>
          <Button
            asChild
            className='bg-[#003d9b] text-xs text-white hover:bg-[#003d9b]/90'
          >
            <Link href='/dashboard/employees/new-employee'>
              <Plus className='size-3.5' />
              Novo Usuário
            </Link>
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <DashboardStatCard
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
          title='Usuários Ativos'
          value={metrics.activeEmployees}
          icon={UserCheck}
          tone='green'
          footer={
            <span className='mb-1 text-xs text-[#434654]'>vs mês anterior</span>
          }
        />
        <DashboardStatCard
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
        <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6'>
          <h2 className='text-lg font-semibold text-[#121d22]'>
            Crescimento de Usuários
          </h2>
          <UserGrowthChart data={metrics.userGrowth} />
        </div>
        <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6'>
          <h2 className='text-lg font-semibold text-[#121d22]'>
            Usuários por Setor
          </h2>
          <UsersByDepartmentChart data={metrics.departmentBreakdown} />
        </div>
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
          <h2 className='text-lg font-semibold text-[#121d22]'>
            Lista de Usuários
          </h2>
          <ListSearchInput
            defaultValue={q ?? ''}
            placeholder='Buscar usuário...'
          />
        </div>

        <DashboardEmployeesTable
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

export default Dashboard
