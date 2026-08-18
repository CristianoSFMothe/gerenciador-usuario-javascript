import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/app/_lib/utils'

type DashboardStatCardTone = 'blue' | 'green' | 'red'

type DashboardStatCardProps = {
  title: string
  value: number
  icon: LucideIcon
  tone: DashboardStatCardTone
  footer: ReactNode
}

const TONE_CLASSES: Record<
  DashboardStatCardTone,
  { overlay: string; iconBg: string; icon: string }
> = {
  blue: {
    overlay: 'bg-[#003d9b]/5',
    iconBg: 'bg-[#003d9b]/10',
    icon: 'text-[#003d9b]',
  },
  green: {
    overlay: 'bg-[#00a65a]/5',
    iconBg: 'bg-[#00a65a]/10',
    icon: 'text-[#00a65a]',
  },
  red: {
    overlay: 'bg-[#d93025]/5',
    iconBg: 'bg-[#d93025]/10',
    icon: 'text-[#d93025]',
  },
}

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  tone,
  footer,
}: DashboardStatCardProps) => {
  const toneClasses = TONE_CLASSES[tone]

  return (
    <div className='relative flex flex-col gap-4 overflow-hidden rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div
        className={cn(
          'absolute -top-4 -right-4 size-24 rounded-bl-xl',
          toneClasses.overlay,
        )}
      />

      <div className='relative flex items-start justify-between'>
        <span className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
          {title}
        </span>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            toneClasses.iconBg,
          )}
        >
          <Icon className={cn('size-5', toneClasses.icon)} />
        </div>
      </div>

      <div className='relative flex items-end gap-2'>
        <span className='text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#121d22] dark:text-[#f1f5f9]'>
          {value}
        </span>
        {footer}
      </div>
    </div>
  )
}

export default DashboardStatCard
