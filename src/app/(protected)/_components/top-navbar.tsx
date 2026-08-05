import { Bell, CircleHelp, Search } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'

import UserMenu from './user-menu'

const TopNavbar = () => {
  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6'>
      <div className='relative w-72'>
        <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500' />
        <Input
          type='search'
          placeholder='Pesquisar...'
          className='rounded-xl border-slate-200 bg-sky-50 pl-9'
        />
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='relative rounded-xl'>
          <Bell className='size-5' />
          <span className='absolute top-1 right-1 size-2 rounded-full bg-red-600' />
        </Button>

        <Button variant='ghost' size='icon' className='rounded-xl'>
          <CircleHelp className='size-5' />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}

export default TopNavbar
