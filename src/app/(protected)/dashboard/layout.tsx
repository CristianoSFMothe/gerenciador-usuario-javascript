import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'

import SideNavBar from '../_components/side-navbar'
import TopNavbar from '../_components/top-navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='flex h-screen overflow-hidden'>
      <SideNavBar />

      <div className='flex flex-1 flex-col overflow-hidden'>
        <TopNavbar />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
}
