import { Quote } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card'

type AuthenticationCardProps = {
  title: string
  description: string
  imageSrc: string
  quote: string
  quoteAuthor: string
  quoteAuthorEmail: string
  children: ReactNode
}

const AuthenticationCard = ({
  title,
  description,
  imageSrc,
  quote,
  quoteAuthor,
  quoteAuthorEmail,
  children,
}: AuthenticationCardProps) => {
  return (
    <main className='grid min-h-screen lg:grid-cols-2'>
      <aside className='relative hidden lg:block'>
        <Image
          src={imageSrc}
          alt=''
          fill
          priority
          quality={10}
          className='object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />

        <div className='absolute inset-x-10 bottom-10 text-white'>
          <Quote className='mb-4 size-8 fill-white text-white' />
          <p className='text-lg leading-relaxed font-medium'>{quote}</p>
          <p className='mt-4 text-sm font-semibold'>{quoteAuthor}</p>
          <p className='text-sm text-white/70'>{quoteAuthorEmail}</p>
        </div>
      </aside>

      <section className='flex items-center justify-center px-6 py-16 sm:px-10'>
        <Card className='w-full max-w-md gap-6 rounded-2xl border border-[#dfe1e6] bg-white p-8 shadow-none dark:border-[#1e293b] dark:bg-[#0f172a]'>
          <CardHeader className='px-0 text-center'>
            <CardTitle className='text-3xl font-extrabold tracking-tight'>
              {title}
            </CardTitle>
            <CardDescription className='mt-2 text-sm text-[#434654] dark:text-[#94a3b8]'>
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className='px-0'>{children}</CardContent>
        </Card>
      </section>
    </main>
  )
}

export default AuthenticationCard
