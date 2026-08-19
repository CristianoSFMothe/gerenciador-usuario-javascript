import { Skeleton } from '@/app/_components/ui/skeleton'

type FormPageSkeletonProps = {
  fields?: number
}

const FormPageSkeleton = ({ fields = 8 }: FormPageSkeletonProps) => {
  return (
    <div className='p-4 sm:p-8'>
      <div className='flex flex-col gap-8'>
        <Skeleton className='h-8 w-72' />

        <div className='flex flex-col gap-8 rounded-lg border border-[#dfe1e6] bg-white p-4 sm:p-8 dark:border-[#1e293b] dark:bg-[#0f172a]'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {Array.from({ length: fields }).map((_, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <Skeleton className='h-3 w-24' />
                <Skeleton className='h-9 w-full' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPageSkeleton
