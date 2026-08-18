import { format } from 'date-fns'
import { CalendarDays, Mail, ShieldAlert, ShieldCheck } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/app/_components/ui/avatar'
import { cn } from '@/app/_lib/utils'
import { getInitials } from '@/app/_utils/get-initials'

type ProfileContactCardProps = {
  user: {
    name: string
    email: string
    emailVerified: boolean
    createdAt: Date
  }
  employee?: {
    position: string
    company: { tradeName: string }
  }
}

const ProfileContactCard = ({ user, employee }: ProfileContactCardProps) => {
  return (
    <div className='flex flex-col items-center gap-3 rounded-lg border border-[#dfe1e6] bg-white p-6 text-center drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'>
      <Avatar size='lg' className='size-24'>
        <AvatarFallback className='text-2xl'>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className='flex flex-col gap-1'>
        <span className='text-lg font-semibold text-[#121d22]'>
          {user.name}
        </span>
        {employee ? (
          <span className='text-sm text-[#434654]'>
            {employee.position} · {employee.company.tradeName}
          </span>
        ) : null}
      </div>

      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.25 py-0.75 text-xs font-semibold',
          user.emailVerified
            ? 'bg-[#e3f5e9] text-[#15803d]'
            : 'bg-[#fdf2e3] text-[#b45309]',
        )}
      >
        {user.emailVerified ? (
          <ShieldCheck className='size-3' />
        ) : (
          <ShieldAlert className='size-3' />
        )}
        {user.emailVerified ? 'E-mail verificado' : 'E-mail não verificado'}
      </span>

      <div className='mt-2 flex w-full flex-col gap-3 border-t border-[#dfe1e6] pt-4 text-left'>
        <div className='flex items-center gap-2 text-sm text-[#434654]'>
          <Mail className='size-4 shrink-0' />
          <span className='truncate'>{user.email}</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-[#434654]'>
          <CalendarDays className='size-4 shrink-0' />
          Membro desde {format(user.createdAt, 'dd/MM/yyyy')}
        </div>
      </div>
    </div>
  )
}

export default ProfileContactCard
