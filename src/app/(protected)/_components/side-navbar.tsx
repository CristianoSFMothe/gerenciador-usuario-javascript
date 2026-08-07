'use client'

import {
  Briefcase,
  Building2,
  IdCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/app/_lib/utils'

import { logoutAction } from '../_actions/auth/logout-action'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Funcionários', href: '/dashboard/employees', icon: Users },
  { label: 'Empresas', href: '/dashboard/companies', icon: Building2 },
  { label: 'Cargos', href: '/dashboard/positions', icon: IdCard },
]

const isLinkActive = (pathname: string, href: string) => {
  if (href === '/dashboard') return pathname === href

  return pathname === href || pathname.startsWith(`${href}/`)
}

const navItemClassName = (active: boolean) =>
  cn(
    'flex items-center gap-2 rounded-sm py-2 pr-[18px] pl-4 text-xs font-semibold tracking-[0.6px]',
    active
      ? 'border-r-2 border-[#003d9b] bg-[#003d9b]/5 text-[#003d9b]'
      : 'text-[#434654] hover:bg-[#003d9b]/5',
  )

type SideNavBarProps = {
  open: boolean
  onClose: () => void
}

const SideNavBar = ({ open, onClose }: SideNavBarProps) => {
  const pathname = usePathname()

  return (
    <>
      {open ? (
        <div
          role='button'
          aria-label='Fechar menu'
          tabIndex={-1}
          onClick={onClose}
          className='fixed inset-0 z-40 bg-black/40 lg:hidden'
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col justify-between border-r border-[#dfe1e6] bg-[#f3faff] py-6 transition-transform duration-200 ease-out',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex flex-col gap-8 pb-8'>
          <div className='flex items-center justify-between gap-2 px-4'>
            <div className='flex items-center gap-2'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#003d9b]/10'>
                <Briefcase className='size-5 text-[#003d9b]' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xl leading-7 font-semibold tracking-[0.6px] text-[#003d9b]'>
                  Enterprise System
                </span>
                <span className='text-xs tracking-[0.6px] text-[#434654]'>
                  Management Hub
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={onClose}
              aria-label='Fechar menu'
              className='shrink-0 rounded-md p-1 text-[#434654] hover:bg-[#003d9b]/5 lg:hidden'
            >
              <X className='size-5' />
            </button>
          </div>

          <nav className='flex flex-col gap-1 px-2'>
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const active = isLinkActive(pathname, href)

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={navItemClassName(active)}
                >
                  <Icon className='size-4.5 shrink-0' />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className='flex flex-col gap-1 px-2'>
          <Link
            href='/dashboard/settings'
            onClick={onClose}
            className={navItemClassName(
              isLinkActive(pathname, '/dashboard/settings'),
            )}
          >
            <Settings className='size-5 shrink-0' />
            Configurações
          </Link>

          <button
            type='button'
            onClick={() => logoutAction()}
            className={cn(navItemClassName(false), 'text-left')}
          >
            <LogOut className='size-4.5 shrink-0' />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}

export default SideNavBar
