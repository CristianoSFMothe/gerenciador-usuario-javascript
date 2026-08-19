import { Skeleton } from '@/app/_components/ui/skeleton'
import TableSkeleton from '@/app/(protected)/_components/table-skeleton'

const DashboardLoading = () => {
  return (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-4 w-72' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-36' />
          <Skeleton className='h-9 w-32' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'
          >
            <div className='flex items-center justify-between'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='size-10 rounded-xl' />
            </div>
            <Skeleton className='h-9 w-16' />
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'
          >
            <Skeleton className='h-5 w-48' />
            <Skeleton className='h-64 w-full' />
          </div>
        ))}
      </div>

      <div className='w-full rounded-sm border border-[#dfe1e6] bg-white dark:border-[#1e293b] dark:bg-[#0f172a]'>
        <div className='flex items-center justify-between border-b border-[#dfe1e6] p-4 dark:border-[#1e293b]'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-9 w-72' />
        </div>
        <TableSkeleton columns={7} rows={5} />
      </div>
    </div>
  )
}

export default DashboardLoading
