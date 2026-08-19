'use client'

import { LogOut, User } from 'lucide-react'
import Link from 'next/link'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { getInitials } from '@/app/_utils/get-initials'

import { logoutAction } from '../_actions/auth/logout-action'

type UserMenuProps = {
  user: { name: string; image?: string | null }
}

const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-2'>
        <Avatar className='border border-slate-200 dark:border-[#1e293b]'>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href='/dashboard/profile'>
            <User />
            Perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant='destructive' onSelect={() => logoutAction()}>
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
