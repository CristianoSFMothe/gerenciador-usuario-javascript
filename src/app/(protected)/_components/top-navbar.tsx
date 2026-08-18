import { Bell, CircleHelp, Menu, Search } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'

import UserMenu from './user-menu'

type TopNavbarProps = {
  onMenuClick: () => void
}

const TopNavbar = ({ onMenuClick }: TopNavbarProps) => {
  return (
    <header className='flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex min-w-0 items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onMenuClick}
          aria-label='Abrir menu'
          className='shrink-0 rounded-xl lg:hidden'
        >
          <Menu className='size-5' />
        </Button>

        <div className='relative min-w-0 flex-1 sm:w-72 sm:flex-none'>
          <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500 dark:text-[#94a3b8]' />
          <Input
            type='search'
            placeholder='Pesquisar...'
            className='rounded-xl border-slate-200 bg-sky-50 pl-9 dark:border-[#1e293b] dark:bg-[#1e293b]'
          />
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1 sm:gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='relative hidden rounded-xl sm:inline-flex'
        >
          <Bell className='size-5' />
          <span className='absolute top-1 right-1 size-2 rounded-full bg-red-600' />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='hidden rounded-xl sm:inline-flex'
        >
          <CircleHelp className='size-5' />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}

export default TopNavbar
