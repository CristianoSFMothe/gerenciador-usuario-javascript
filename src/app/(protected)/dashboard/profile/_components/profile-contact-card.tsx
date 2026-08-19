import { format } from 'date-fns'
import { CalendarDays, Mail, ShieldAlert, ShieldCheck } from 'lucide-react'

import { Badge } from '@/app/_components/ui/badge'
import { Card, CardContent } from '@/app/_components/ui/card'
import { cn } from '@/app/_lib/utils'

import ProfileAvatarUpload from './profile-avatar-upload'

type ProfileContactCardProps = {
  user: {
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date
  }
  employee?: {
    position: string
    company: { tradeName: string }
  }
}

const ProfileContactCard = ({ user, employee }: ProfileContactCardProps) => {
  return (
    <Card className='gap-0 overflow-hidden rounded-lg border-[#dfe1e6] p-0 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <CardContent className='grid grid-cols-1 gap-0 p-0 sm:grid-cols-2'>
        <ProfileAvatarUpload name={user.name} image={user.image} />

        <div className='flex flex-col justify-center gap-3 p-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
              {user.name}
            </span>
            {employee ? (
              <span className='text-sm text-[#434654] dark:text-[#94a3b8]'>
                {employee.position} · {employee.company.tradeName}
              </span>
            ) : null}
          </div>

          <Badge
            variant='outline'
            className={cn(
              'w-fit gap-1 border-transparent px-2.25 py-0.75 text-xs font-semibold',
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
          </Badge>

          <div className='flex flex-col gap-2 border-t border-[#dfe1e6] pt-3 dark:border-[#1e293b]'>
            <div className='flex items-center gap-2 text-sm text-[#434654] dark:text-[#94a3b8]'>
              <Mail className='size-4 shrink-0' />
              <span className='truncate'>{user.email}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-[#434654] dark:text-[#94a3b8]'>
              <CalendarDays className='size-4 shrink-0' />
              Membro desde {format(user.createdAt, 'dd/MM/yyyy')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileContactCard
