import { Eye, Shield, ShieldCheck, UserCog } from 'lucide-react'
import type { ComponentType } from 'react'

import { Button } from '@/app/_components/ui/button'
import { cn } from '@/app/_lib/utils'
import type { RoleListItem } from '@/app/(protected)/_actions/roles/get-roles'

import {
  ROLE_STATUS_BADGE_CLASSNAME,
  ROLE_STATUS_LABEL,
} from '../_lib/role-status'
import RoleFormDialog from './role-form-dialog'

const ROLE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Administrador: ShieldCheck,
  Gerente: UserCog,
  Visualizador: Eye,
}

type RoleCardProps = {
  role: RoleListItem
}

const RoleCard = ({ role }: RoleCardProps) => {
  const Icon = ROLE_ICONS[role.name] ?? Shield
  const userCount = role._count.users

  return (
    <div className='flex flex-1 flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#003d9b]/10 dark:bg-[#60a5fa]/10'>
            <Icon className='size-5 text-[#003d9b] dark:text-[#60a5fa]' />
          </div>
          <span className='text-base font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
            {role.name}
          </span>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-full px-2.25 py-0.75 text-xs font-semibold',
            ROLE_STATUS_BADGE_CLASSNAME[role.status],
          )}
        >
          {ROLE_STATUS_LABEL[role.status]}
        </span>
      </div>

      <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
        {role.description}
      </p>

      <div className='mt-auto flex items-center justify-between border-t border-[#dfe1e6] pt-4 dark:border-[#1e293b]'>
        <span className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          {userCount} {userCount === 1 ? 'usuário' : 'usuários'} vinculado
          {userCount === 1 ? '' : 's'}
        </span>

        <RoleFormDialog
          role={role}
          trigger={
            <Button
              type='button'
              variant='link'
              className='h-auto p-0 text-sm text-[#003d9b] dark:text-[#60a5fa]'
            >
              Editar
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default RoleCard
