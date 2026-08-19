'use client'

import { useState } from 'react'

import { exportCompaniesAction } from '@/app/(protected)/_actions/companies/export-companies-action'
import type {
  CompanyListItem,
  CompanySortField,
  CompanySortOrder,
  CompanyStatusFilter as CompanyStatusFilterValue,
} from '@/app/(protected)/_actions/companies/get-companies'
import ExportMenu from '@/app/(protected)/_components/export-menu'
import ListSearchInput from '@/app/(protected)/_components/list-search-input'
import StatusFilter, {
  type StatusFilterOption,
} from '@/app/(protected)/_components/status-filter'

import CompaniesPagination from './companies-pagination'
import CompaniesTable from './companies-table'

const COMPANY_STATUS_OPTIONS: StatusFilterOption<CompanyStatusFilterValue>[] = [
  { value: 'active', label: 'Ativas' },
  { value: 'inactive', label: 'Inativas' },
  { value: 'all', label: 'Todas' },
]

type CompaniesListPanelProps = {
  companies: CompanyListItem[]
  query?: string
  sortBy: CompanySortField
  sortOrder: CompanySortOrder
  status: CompanyStatusFilterValue
  totalCount: number
  pageSize: number
  currentPage: number
}

const CompaniesListPanel = ({
  companies,
  query,
  sortBy,
  sortOrder,
  status,
  totalCount,
  pageSize,
  currentPage,
}: CompaniesListPanelProps) => {
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
      previous.size === companies.length
        ? new Set()
        : new Set(companies.map((company) => company.id)),
    )
  }

  return (
    <div className='w-full rounded-sm border border-[#dfe1e6] bg-white dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4 dark:border-[#1e293b]'>
        <ListSearchInput
          defaultValue={query ?? ''}
          placeholder='Buscar empresa por nome ou CNPJ...'
        />

        <div className='flex gap-2'>
          <StatusFilter
            status={status}
            options={COMPANY_STATUS_OPTIONS}
            query={query}
            sortBy={sortBy}
            sortOrder={sortOrder}
            defaultStatus='active'
          />
          <ExportMenu
            selectedCount={selectedIds.size}
            onExport={(mode) =>
              exportCompaniesAction(
                mode === 'selected'
                  ? { mode: 'selected', ids: [...selectedIds] }
                  : { mode: 'all', query, sortBy, sortOrder, status },
              )
            }
          />
        </div>
      </div>

      <CompaniesTable
        companies={companies}
        query={query}
        sortBy={sortBy}
        sortOrder={sortOrder}
        status={status}
        selectedIds={selectedIds}
        onToggleRow={handleToggleRow}
        onToggleAll={handleToggleAll}
      />

      <CompaniesPagination
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

export default CompaniesListPanel
