import { format } from 'date-fns'

import { Badge } from '@/app/_components/ui/badge'
import { cn } from '@/app/_lib/utils'

import {
  EMPLOYEE_NOTE_TYPE_BADGE_CLASSNAME,
  EMPLOYEE_NOTE_TYPE_LABEL,
  type EmployeeNoteTypeValue,
} from '../_lib/employee-note-type'
import AddEmployeeNoteDialog from './add-employee-note-dialog'

type NoteRow = {
  id: string
  type: EmployeeNoteTypeValue
  content: string
  createdAt: Date
  author: { name: string } | null
}

type ProfileNotesCardProps = {
  employeeId: string
  notes?: NoteRow[]
}

const ProfileNotesCard = ({ employeeId, notes }: ProfileNotesCardProps) => {
  const hasNotes = Boolean(notes && notes.length > 0)

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
          Feedback &amp; Notas
        </h2>
        <AddEmployeeNoteDialog employeeId={employeeId} />
      </div>

      {hasNotes ? (
        <div className='flex flex-col gap-4'>
          {notes?.map((note) => (
            <div
              key={note.id}
              className='flex flex-col gap-2 border-b border-[#dfe1e6] pb-4 last:border-b-0 last:pb-0 dark:border-[#1e293b]'
            >
              <div className='flex items-center justify-between'>
                <Badge
                  variant='outline'
                  className={cn(
                    'w-fit border-transparent',
                    EMPLOYEE_NOTE_TYPE_BADGE_CLASSNAME[note.type],
                  )}
                >
                  {EMPLOYEE_NOTE_TYPE_LABEL[note.type]}
                </Badge>
                <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                  {format(note.createdAt, 'dd/MM/yyyy')}
                </span>
              </div>
              <p className='text-sm text-[#121d22] dark:text-[#f1f5f9]'>
                {note.content}
              </p>
              {note.author ? (
                <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                  Por {note.author.name}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          Nenhuma nota registrada ainda.
        </div>
      )}
    </div>
  )
}

export default ProfileNotesCard
