import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Button } from '@/app/_components/ui/button'
import { auth } from '@/app/_lib/auth'
import { getEmployeeByUser } from '@/app/(protected)/_actions/employees/get-employee-by-user'

import { logoutAction } from '../../_actions/auth/logout-action'
import ProfileActivityCard from './_components/profile-activity-card'
import ProfileContactCard from './_components/profile-contact-card'
import ProfileDocumentsCard from './_components/profile-documents-card'
import ProfileEmploymentHistoryCard from './_components/profile-employment-history-card'

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/login')

  const employee = await getEmployeeByUser(session.user.id)

  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px]'>
            Meu Perfil
          </h1>
          <p className='text-sm text-[#434654]'>
            Gerencie os detalhes e atividades de {session.user.name}.
          </p>
        </div>

        <div className='flex gap-3'>
          <Button
            type='button'
            variant='outline'
            disabled
            title='Disponível em breve'
            className='border-[#003d9b] text-[#003d9b] dark:border-[#60a5fa] dark:text-[#60a5fa]'
          >
            Editar Perfil
          </Button>

          <form action={logoutAction}>
            <Button
              type='submit'
              className='bg-[#003d9b] text-white hover:bg-[#003d9b]/90'
            >
              Sair
            </Button>
          </form>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='flex flex-col gap-6 lg:col-span-1'>
          <ProfileContactCard
            user={session.user}
            employee={employee ?? undefined}
          />
          <ProfileDocumentsCard />
        </div>

        <div className='flex flex-col gap-6 lg:col-span-2'>
          <ProfileEmploymentHistoryCard
            history={employee?.employmentHistory}
            companyName={employee?.company.tradeName}
          />
          <ProfileActivityCard />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
