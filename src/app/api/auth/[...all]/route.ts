import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/app/_lib/auth'

export const { POST, GET } = toNextJsHandler(auth)
