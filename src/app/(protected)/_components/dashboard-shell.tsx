'use client'

import { useState } from 'react'

import SideNavBar from './side-navbar'
import TopNavbar from './top-navbar'

type DashboardShellProps = {
  user: { name: string; image?: string | null }
  children: React.ReactNode
}

const DashboardShell = ({ user, children }: DashboardShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='fixed inset-0 flex overflow-hidden'>
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
        <TopNavbar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className='min-h-0 flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardShell
