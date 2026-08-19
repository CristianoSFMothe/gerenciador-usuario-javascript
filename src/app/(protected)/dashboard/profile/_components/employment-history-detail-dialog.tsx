'use client'

import { format } from 'date-fns'
import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { cn } from '@/app/_lib/utils'
import { formatCurrencyBRL } from '@/app/_utils/format-currency'

import {
  EMPLOYMENT_STATUS_BADGE_CLASSNAME,
  EMPLOYMENT_STATUS_LABEL,
} from '../_lib/employment-status'
import {
  SALARY_REASON_LABEL,
  type SalaryChangeReasonValue,
} from '../_lib/salary-reason'

type SalaryHistoryRow = {
  id: string
  amount: number
  reason: SalaryChangeReasonValue
  effectiveDate: Date
}

type EmploymentHistoryDetailDialogProps = {
  trigger: ReactNode
  companyName?: string
  entry: {
    position: string
    description: string | null
    startDate: Date
    endDate: Date | null
  }
  salaryHistory?: SalaryHistoryRow[]
}

const EmploymentHistoryDetailDialog = ({
  trigger,
  companyName,
  entry,
  salaryHistory,
}: EmploymentHistoryDetailDialogProps) => {
  const status = entry.endDate === null ? 'CURRENT' : 'PAST'

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry.position}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-[#434654] dark:text-[#94a3b8]'>Empresa</span>
            <span className='font-medium text-[#121d22] dark:text-[#f1f5f9]'>
              {companyName ?? '-'}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-[#434654] dark:text-[#94a3b8]'>Período</span>
            <span className='font-medium text-[#121d22] dark:text-[#f1f5f9]'>
              {format(entry.startDate, 'dd/MM/yyyy')} –{' '}
              {entry.endDate ? format(entry.endDate, 'dd/MM/yyyy') : 'Atual'}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-[#434654] dark:text-[#94a3b8]'>Status</span>
            <span
              className={cn(
                'rounded-full px-2.25 py-0.75 text-xs font-semibold',
                EMPLOYMENT_STATUS_BADGE_CLASSNAME[status],
              )}
            >
              {EMPLOYMENT_STATUS_LABEL[status]}
            </span>
          </div>

          <div className='flex flex-col gap-1 border-t border-[#dfe1e6] pt-4 dark:border-[#1e293b]'>
            <span className='text-[#434654] dark:text-[#94a3b8]'>
              Descrição do cargo
            </span>
            <p className='text-[#121d22] dark:text-[#f1f5f9]'>
              {entry.description || 'Nenhuma descrição registrada.'}
            </p>
          </div>

          <div className='flex flex-col gap-2 border-t border-[#dfe1e6] pt-4 dark:border-[#1e293b]'>
            <span className='text-[#434654] dark:text-[#94a3b8]'>
              Anotações de salário
            </span>
            {salaryHistory && salaryHistory.length > 0 ? (
              <div className='flex flex-col gap-2'>
                {salaryHistory.map((row) => (
                  <div
                    key={row.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex flex-col'>
                      <span className='font-medium text-[#121d22] dark:text-[#f1f5f9]'>
                        {formatCurrencyBRL(row.amount)}
                      </span>
                      <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                        {SALARY_REASON_LABEL[row.reason]}
                      </span>
                    </div>
                    <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                      {format(row.effectiveDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-[#121d22] dark:text-[#f1f5f9]'>
                Nenhuma anotação de salário registrada.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmploymentHistoryDetailDialog
