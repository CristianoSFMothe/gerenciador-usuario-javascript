import { Skeleton } from '@/app/_components/ui/skeleton'

import TableSkeleton from './table-skeleton'

type ListPageSkeletonProps = {
  columns?: number
  rows?: number
}

const ListPageSkeleton = ({ columns = 5, rows = 8 }: ListPageSkeletonProps) => {
  return (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <Skeleton className='h-9 w-36' />
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white dark:border-[#1e293b] dark:bg-[#0f172a]'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4 dark:border-[#1e293b]'>
          <Skeleton className='h-9 w-96' />
          <div className='flex gap-2'>
            <Skeleton className='h-9 w-24' />
            <Skeleton className='h-9 w-24' />
          </div>
        </div>

        <TableSkeleton columns={columns} rows={rows} />

        <div className='flex items-center justify-between border-t border-[#dfe1e6] px-4 py-4 dark:border-[#1e293b]'>
          <Skeleton className='h-8 w-64' />
        </div>
      </div>
    </div>
  )
}

export default ListPageSkeleton
