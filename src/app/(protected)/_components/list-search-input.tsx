'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Input } from '@/app/_components/ui/input'

const SEARCH_DEBOUNCE_IN_MS = 400

type ListSearchInputProps = {
  defaultValue: string
  placeholder: string
  testId?: string
}

const ListSearchInput = ({
  defaultValue,
  placeholder,
  testId,
}: ListSearchInputProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      params.delete('page')

      router.replace(`${pathname}?${params.toString()}`)
    }, SEARCH_DEBOUNCE_IN_MS)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the typed value changes, not on every searchParams/router identity change
  }, [value])

  return (
    <div className='relative w-96'>
      <Search className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8]' />
      <Input
        type='search'
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        data-testid={testId}
        className='rounded-none border-[#dfe1e6] bg-[#f3faff] pl-9 text-sm dark:border-[#1e293b] dark:bg-[#1e293b]'
      />
    </div>
  )
}

export default ListSearchInput
