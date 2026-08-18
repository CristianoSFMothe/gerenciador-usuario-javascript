import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'
import { getEmployeeByUser } from '@/app/(protected)/_actions/employees/get-employee-by-user'

import NotificationsCard from './_components/notifications-card'
import ProfileSummaryCard from './_components/profile-summary-card'
import SystemPreferencesCard from './_components/system-preferences-card'

const SettingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/login')

  const employee = await getEmployeeByUser(session.user.id)

  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px] dark:text-[#f1f5f9]'>
          Configurações do Sistema
        </h1>
        <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          Gerencie suas preferências, perfil e notificações.
        </p>
      </div>

      <ProfileSummaryCard
        name={session.user.name}
        email={session.user.email}
        position={employee?.position}
      />

      <SystemPreferencesCard />

      <NotificationsCard />
    </div>
  )
}

export default SettingsPage
