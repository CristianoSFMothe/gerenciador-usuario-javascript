import { Skeleton } from '@/app/_components/ui/skeleton'
import TableSkeleton from '@/app/(protected)/_components/table-skeleton'

const RolesLoading = () => {
  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-56' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='flex shrink-0 gap-3'>
          <Skeleton className='h-9 w-36' />
          <Skeleton className='h-9 w-32' />
        </div>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='flex flex-1 flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'
          >
            <div className='flex items-center gap-3'>
              <Skeleton className='size-10 rounded-lg' />
              <Skeleton className='h-5 w-24' />
            </div>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-32' />
          </div>
        ))}
      </div>

      <div className='rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
        <Skeleton className='mb-4 h-5 w-56' />
        <TableSkeleton columns={4} rows={6} />
      </div>
    </div>
  )
}

export default RolesLoading
