import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { cn } from '@/app/_lib/utils'

import {
  EMPLOYMENT_STATUS_BADGE_CLASSNAME,
  EMPLOYMENT_STATUS_LABEL,
} from '../_lib/employment-status'

const COLUMN_LABELS = ['Empresa', 'Cargo', 'Período', 'Status']

type HistoryRow = {
  id: string
  position: string
  startDate: Date
  endDate: Date | null
}

type ProfileEmploymentHistoryCardProps = {
  history?: HistoryRow[]
  companyName?: string
}

const ProfileEmploymentHistoryCard = ({
  history,
  companyName,
}: ProfileEmploymentHistoryCardProps) => {
  const hasHistory = Boolean(history && history.length > 0)

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Histórico Profissional
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
            history?.map((row) => {
              const status = row.endDate === null ? 'CURRENT' : 'PAST'

              return (
                <TableRow
                  key={row.id}
                  className='border-[#dfe1e6] dark:border-[#1e293b]'
                >
                  <TableCell className='p-4 text-sm text-[#434654] dark:text-[#94a3b8]'>
                    {companyName}
                  </TableCell>
                  <TableCell className='p-4 text-sm text-[#121d22] dark:text-[#f1f5f9]'>
                    {row.position}
                  </TableCell>
                  <TableCell className='p-4 text-sm text-[#434654] dark:text-[#94a3b8]'>
                    {format(row.startDate, 'dd/MM/yyyy')} –{' '}
                    {row.endDate ? format(row.endDate, 'dd/MM/yyyy') : 'Atual'}
                  </TableCell>
                  <TableCell className='p-4'>
                    <span
                      className={cn(
                        'rounded-full px-2.25 py-0.75 text-xs font-semibold',
                        EMPLOYMENT_STATUS_BADGE_CLASSNAME[status],
                      )}
                    >
                      {EMPLOYMENT_STATUS_LABEL[status]}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow className='border-[#dfe1e6] hover:bg-transparent dark:border-[#1e293b]'>
              <TableCell
                colSpan={COLUMN_LABELS.length}
                className='p-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'
              >
                Nenhum vínculo empregatício registrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProfileEmploymentHistoryCard
