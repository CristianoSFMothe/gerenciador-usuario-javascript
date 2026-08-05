import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'

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
      {/* sidebar + topbar */}
      {children}
    </div>
  )
}
