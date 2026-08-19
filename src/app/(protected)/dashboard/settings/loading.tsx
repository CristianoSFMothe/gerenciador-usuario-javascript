import { Skeleton } from '@/app/_components/ui/skeleton'

const SettingsLoading = () => {
  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-80' />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'
        >
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-24 w-full' />
        </div>
      ))}
    </div>
  )
}

export default SettingsLoading
