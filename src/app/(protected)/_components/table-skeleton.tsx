import { Skeleton } from '@/app/_components/ui/skeleton'

type TableSkeletonProps = {
  columns?: number
  rows?: number
}

const TableSkeleton = ({ columns = 5, rows = 8 }: TableSkeletonProps) => {
  return (
    <div>
      <div className='flex border-b border-[#dfe1e6] bg-[#f8f9fa] p-4 dark:border-[#1e293b] dark:bg-[#1e293b]'>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className='mr-6 h-3 w-20 last:mr-0' />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className='flex items-center border-b border-[#dfe1e6] p-4 last:border-b-0 dark:border-[#1e293b]'
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className='mr-6 h-4 w-24 last:mr-0' />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
