'use client'

import { useState } from 'react'

import SideNavBar from './side-navbar'
import TopNavbar from './top-navbar'

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='fixed inset-0 flex overflow-hidden'>
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className='min-h-0 flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardShell
