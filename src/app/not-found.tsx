import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'

export default function NotFound() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <div className='bg-muted flex size-16 items-center justify-center rounded-full'>
        <FileQuestion className='text-muted-foreground size-8' />
      </div>

      <div className='flex flex-col gap-2'>
        <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
          Página não encontrada
        </h1>
        <p className='text-muted-foreground max-w-sm text-sm'>
          A página que você está procurando não existe, foi movida ou o endereço
          digitado está incorreto.
        </p>
      </div>

      <Button asChild>
        <Link href='/dashboard'>Voltar ao início</Link>
      </Button>
    </div>
  )
}
