'use client'

import { Filter } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/app/_components/ui/button'
import { exportEmployeesAction } from '@/app/(protected)/_actions/employees/export-employees-action'
import type {
  EmployeeListItem,
  EmployeeSortField,
  EmployeeSortOrder,
} from '@/app/(protected)/_actions/employees/get-employees'
import EmployeesPagination from '@/app/(protected)/_components/employees-pagination'
import ExportMenu from '@/app/(protected)/_components/export-menu'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'

import EmployeesTable from './employees-table'

type EmployeesListPanelProps = {
  employees: EmployeeListItem[]
  query?: string
  sortBy: EmployeeSortField
  sortOrder: EmployeeSortOrder
  totalCount: number
  pageSize: number
  currentPage: number
}

const EmployeesListPanel = ({
  employees,
  query,
  sortBy,
  sortOrder,
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
    <div className='w-full rounded-sm border border-[#dfe1e6] bg-white'>
      <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4'>
        <ListSearchInput
          defaultValue={query ?? ''}
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
          <ExportMenu
            selectedCount={selectedIds.size}
            onExport={(mode) =>
              exportEmployeesAction(
                mode === 'selected'
                  ? { mode: 'selected', ids: [...selectedIds] }
                  : { mode: 'all', query, sortBy, sortOrder },
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
      />
    </div>
  )
}

export default EmployeesListPanel
