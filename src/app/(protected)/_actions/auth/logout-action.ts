'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_lib/auth'

export const logoutAction = async () => {
  await auth.api.signOut({ headers: await headers() })

  redirect('/login')
}
