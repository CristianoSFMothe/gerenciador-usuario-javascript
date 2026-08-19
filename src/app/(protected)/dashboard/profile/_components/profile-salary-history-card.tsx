import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { formatCurrencyBRL } from '@/app/_utils/format-currency'

import { SALARY_REASON_LABEL } from '../_lib/salary-reason'

const COLUMN_LABELS = ['Valor', 'Motivo', 'Data']

type SalaryHistoryRow = {
  id: string
  amount: { toNumber: () => number }
  reason: keyof typeof SALARY_REASON_LABEL
  effectiveDate: Date
}

type ProfileSalaryHistoryCardProps = {
  history?: SalaryHistoryRow[]
}

const ProfileSalaryHistoryCard = ({
  history,
}: ProfileSalaryHistoryCardProps) => {
  const hasHistory = Boolean(history && history.length > 0)
  const lastIndex = (history?.length ?? 0) - 1

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Histórico Salarial
      </h2>

      <Table>
        <TableHeader>
          <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa] dark:border-[#1e293b] dark:bg-[#1e293b] dark:hover:bg-[#1e293b]'>
            {COLUMN_LABELS.map((label) => (
              <TableHead
                key={label}
                className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasHistory ? (
            history?.map((row, index) => (
              <TableRow
                key={row.id}
                className='border-[#dfe1e6] dark:border-[#1e293b]'
              >
                <TableCell className='p-4 text-sm font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
                  <div className='flex items-center gap-2'>
                    {formatCurrencyBRL(row.amount.toNumber())}
                    {index === lastIndex ? (
                      <span className='rounded-full bg-[#e3f5e9] px-2.25 py-0.75 text-xs font-semibold text-[#15803d]'>
                        Atual
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className='p-4 text-sm text-[#434654] dark:text-[#94a3b8]'>
                  {SALARY_REASON_LABEL[row.reason]}
                </TableCell>
                <TableCell className='p-4 text-sm text-[#434654] dark:text-[#94a3b8]'>
                  {format(row.effectiveDate, 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className='border-[#dfe1e6] hover:bg-transparent dark:border-[#1e293b]'>
              <TableCell
                colSpan={COLUMN_LABELS.length}
                className='p-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'
              >
                Nenhum registro salarial ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProfileSalaryHistoryCard
