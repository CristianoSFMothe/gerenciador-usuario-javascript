import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'

type ListPageHeaderProps = {
  title: string
  description: string
  actionLabel: string
  actionHref: string
}

const ListPageHeader = ({
  title,
  description,
  actionLabel,
  actionHref,
}: ListPageHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[28px] font-semibold tracking-tight text-[#121d22] dark:text-[#f1f5f9]'>
          {title}
        </h1>
        <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          {description}
        </p>
      </div>

      <Button
        asChild
        className='bg-[#003d9b] text-xs text-white hover:bg-[#003d9b]/90'
      >
        <Link href={actionHref}>
          <Plus className='size-3.5' />
          {actionLabel}
        </Link>
      </Button>
    </div>
  )
}

export default ListPageHeader
