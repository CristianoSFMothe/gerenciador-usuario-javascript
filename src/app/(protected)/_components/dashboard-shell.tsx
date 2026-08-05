'use client'

import { useState } from 'react'

import SideNavBar from './side-navbar'
import TopNavbar from './top-navbar'

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex h-screen overflow-hidden'>
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex flex-1 flex-col overflow-hidden'>
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardShell
