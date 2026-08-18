'use client'

import { RefreshCw, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/app/_components/ui/button'

const AUTO_RETRY_IN_SECONDS = 8

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const [secondsUntilRetry, setSecondsUntilRetry] = useState(
    AUTO_RETRY_IN_SECONDS,
  )

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    if (secondsUntilRetry <= 0) {
      reset()
      return
    }

    const timeout = setTimeout(
      () => setSecondsUntilRetry((value) => value - 1),
      1000,
    )

    return () => clearTimeout(timeout)
  }, [secondsUntilRetry, reset])

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <div className='flex size-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40'>
        <TriangleAlert className='size-8 text-red-600 dark:text-red-400' />
      </div>

      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold tracking-tight text-[#121d22] dark:text-[#f1f5f9]'>
          Algo deu errado
        </h1>
        <p className='max-w-sm text-sm text-[#434654] dark:text-[#94a3b8]'>
          Ocorreu um erro inesperado ao carregar esta página. Tentaremos
          novamente em {secondsUntilRetry}s, ou você pode tentar agora.
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          onClick={reset}
          className='gap-2 bg-[#003d9b] text-white hover:bg-[#003d9b]/90'
        >
          <RefreshCw className='size-4' />
          Tentar novamente
        </Button>

        <Button variant='outline' asChild>
          <Link href='/dashboard'>Voltar ao início</Link>
        </Button>
      </div>
    </div>
  )
}
