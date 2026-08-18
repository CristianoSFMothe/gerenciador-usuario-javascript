import { Avatar, AvatarFallback } from '@/app/_components/ui/avatar'
import { Input } from '@/app/_components/ui/input'
import { getInitials } from '@/app/_utils/get-initials'

type ProfileSummaryCardProps = {
  name: string
  email: string
  position?: string
}

const ProfileSummaryCard = ({
  name,
  email,
  position,
}: ProfileSummaryCardProps) => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Perfil do Usuário
      </h2>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
        <Avatar size='lg' className='size-20'>
          <AvatarFallback className='text-xl'>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-1 sm:col-span-1'>
            <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
              Nome Completo
            </span>
            <Input disabled value={name} />
          </div>

          <div className='flex flex-col gap-1 sm:col-span-1'>
            <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
              E-mail Corporativo
            </span>
            <Input disabled value={email} />
          </div>

          {position ? (
            <div className='flex flex-col gap-1 sm:col-span-1'>
              <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                Cargo / Função
              </span>
              <Input disabled value={position} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProfileSummaryCard
