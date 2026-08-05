import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'

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
    <div>
      <TopNavbar />
      {children}
    </div>
  )
}
