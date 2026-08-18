'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import { Input } from '@/app/_components/ui/input'
import { cn } from '@/app/_lib/utils'

type AuthenticationInputProps = ComponentProps<typeof Input> & {
  isPassword?: boolean
}

const AuthenticationInput = ({
  className,
  isPassword,
  type,
  ...props
}: AuthenticationInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='relative'>
      <Input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={cn(
          'h-14 w-full rounded-xl px-6 text-sm',
          isPassword && 'pr-14',
          className,
        )}
        {...props}
      />

      {isPassword ? (
        <button
          type='button'
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-5 flex items-center'
        >
          {showPassword ? (
            <EyeOff className='size-4' />
          ) : (
            <Eye className='size-4' />
          )}
        </button>
      ) : null}
    </div>
  )
}

export default AuthenticationInput
