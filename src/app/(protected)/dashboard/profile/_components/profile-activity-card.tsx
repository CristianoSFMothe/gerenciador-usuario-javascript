import { format } from 'date-fns'
import { Activity } from 'lucide-react'

import { AUDIT_LOG_FIELD_LABEL } from '../_lib/audit-log-field'

type AuditLogFieldValue = 'POSITION' | 'DEPARTMENT' | 'SALARY'

type AuditLogRow = {
  id: string
  field: AuditLogFieldValue
  oldValue: string | null
  newValue: string | null
  changedAt: Date
  changedBy: { name: string } | null
}

type ProfileActivityCardProps = {
  logs?: AuditLogRow[]
}

const ProfileActivityCard = ({ logs }: ProfileActivityCardProps) => {
  const hasLogs = Boolean(logs && logs.length > 0)

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Atividade Recente
      </h2>

      {hasLogs ? (
        <div className='flex flex-col gap-4'>
          {logs?.map((log) => (
            <div
              key={log.id}
              className='flex flex-col gap-1 border-b border-[#dfe1e6] pb-4 last:border-b-0 last:pb-0 dark:border-[#1e293b]'
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-[#121d22] dark:text-[#f1f5f9]'>
                  {AUDIT_LOG_FIELD_LABEL[log.field]} alterado
                </span>
                <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                  {format(log.changedAt, 'dd/MM/yyyy')}
                </span>
              </div>
              <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
                {log.oldValue ?? '-'} → {log.newValue ?? '-'}
              </p>
              {log.changedBy ? (
                <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                  Por {log.changedBy.name}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          <Activity className='size-6 text-[#dfe1e6] dark:text-[#1e293b]' />
          Nenhuma atividade registrada ainda.
        </div>
      )}
    </div>
  )
}

export default ProfileActivityCard
