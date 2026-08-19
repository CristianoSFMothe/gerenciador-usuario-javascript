'use client'

import { useState } from 'react'

import { exportEmployeesAction } from '@/app/(protected)/_actions/employees/export-employees-action'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
  EmployeeStatusFilter,
} from '@/app/(protected)/_actions/employees/get-employees'
import EmployeesPagination from '@/app/(protected)/_components/employees-pagination'
import ExportMenu from '@/app/(protected)/_components/export-menu'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'
import StatusFilter, {
  type StatusFilterOption,
} from '@/app/(protected)/_components/status-filter'

import EmployeesTable from './employees-table'

const EMPLOYEE_STATUS_OPTIONS: StatusFilterOption<EmployeeStatusFilter>[] = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

type EmployeesListPanelProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
  status: EmployeeStatusFilter
  totalCount: number
  pageSize: number
  currentPage: number
}

const EmployeesListPanel = ({
  employees,
  query,
  sortBy,
  sortOrder,
  status,
  totalCount,
  pageSize,
  currentPage,
}: EmployeesListPanelProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleToggleRow = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const handleToggleAll = () => {
    setSelectedIds((previous) =>
      previous.size === employees.length
        ? new Set()
        : new Set(employees.map((employee) => employee.id)),
    )
  }

  return (
    <div className='w-full rounded-sm border border-[#dfe1e6] bg-white dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4 dark:border-[#1e293b]'>
        <ListSearchInput
          defaultValue={query ?? ''}
          placeholder='Buscar funcionário por nome, CPF ou empresa...'
        />

        <div className='flex gap-2'>
          <StatusFilter
            status={status}
            options={EMPLOYEE_STATUS_OPTIONS}
            query={query}
            sortBy={sortBy}
            sortOrder={sortOrder}
            defaultStatus='active'
          />
          <ExportMenu
            selectedCount={selectedIds.size}
            onExport={(mode) =>
              exportEmployeesAction(
                mode === 'selected'
                  ? { mode: 'selected', ids: [...selectedIds] }
                  : { mode: 'all', query, sortBy, sortOrder, status },
              )
            }
          />
        </div>
      </div>

      <EmployeesTable
        employees={employees}
        query={query}
        sortBy={sortBy}
        sortOrder={sortOrder}
        status={status}
        selectedIds={selectedIds}
        onToggleRow={handleToggleRow}
        onToggleAll={handleToggleAll}
      />

      <EmployeesPagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        query={query}
        sortBy={sortBy}
        sortOrder={sortOrder}
        status={status}
      />
    </div>
  )
}

export default EmployeesListPanel
