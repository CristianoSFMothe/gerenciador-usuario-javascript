import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'

import DashboardShell from '../_components/dashboard-shell'

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
    <DashboardShell
      user={{ name: session.user.name, image: session.user.image }}
    >
      {children}
    </DashboardShell>
  )
}
