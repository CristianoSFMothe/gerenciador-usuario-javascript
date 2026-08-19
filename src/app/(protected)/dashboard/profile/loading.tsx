import { Skeleton } from '@/app/_components/ui/skeleton'
import TableSkeleton from '@/app/(protected)/_components/table-skeleton'

const ProfileLoading = () => {
  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-4 w-64' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-9 w-28' />
          <Skeleton className='h-9 w-20' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='flex flex-col gap-6 lg:col-span-1'>
          <div className='flex flex-col items-center gap-3 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
            <Skeleton className='size-24 rounded-full' />
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-40' />
          </div>
          <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-24 w-full' />
          </div>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-2'>
          <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
            <Skeleton className='h-5 w-48' />
            <TableSkeleton columns={4} rows={4} />
          </div>
          <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-24 w-full' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileLoading
