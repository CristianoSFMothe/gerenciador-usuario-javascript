import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card'
import { cn } from '@/app/_lib/utils'

type FormSectionCardProps = {
  icon: LucideIcon
  title: string
  className?: string
  contentClassName?: string
  children: ReactNode
}

const FormSectionCard = ({
  icon: Icon,
  title,
  className,
  contentClassName,
  children,
}: FormSectionCardProps) => {
  return (
    <Card
      className={cn(
        'gap-4 rounded-lg border-[#dfe1e6] bg-white py-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:py-8',
        className,
      )}
    >
      <CardHeader className='border-b border-[#dfe1e6]/50 px-4 pb-3! sm:px-8'>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold text-[#121d22]'>
          <Icon className='size-5 text-[#003d9b]' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('px-4 sm:px-8', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

export default FormSectionCard
