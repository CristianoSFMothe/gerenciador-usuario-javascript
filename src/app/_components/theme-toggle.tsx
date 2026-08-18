'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/app/_lib/utils'

const OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
] as const

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // next-themes hydration-safe mounted check: theme is unknown on the
    // server, so the active option can only be marked after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <div className='grid grid-cols-2 gap-3'>
      {OPTIONS.map((option) => {
        const Icon = option.icon
        const isActive = mounted && theme === option.value

        return (
          <button
            key={option.value}
            type='button'
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-[#003d9b] text-[#003d9b] dark:border-[#60a5fa] dark:text-[#60a5fa]'
                : 'border-[#dfe1e6] text-[#434654] dark:border-[#1e293b] dark:text-[#94a3b8]',
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                isActive
                  ? 'border-[#003d9b] dark:border-[#60a5fa]'
                  : 'border-[#dfe1e6] dark:border-[#1e293b]',
              )}
            >
              {isActive ? (
                <span className='size-2 rounded-full bg-[#003d9b] dark:bg-[#60a5fa]' />
              ) : null}
            </span>
            <Icon className='size-4' />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle
