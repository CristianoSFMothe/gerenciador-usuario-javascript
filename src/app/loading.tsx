import { Skeleton } from '@/app/_components/ui/skeleton'

export default function Loading() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-3 p-16'>
      <Skeleton className='size-10 rounded-full' />
      <Skeleton className='h-4 w-40' />
    </div>
  )
}
