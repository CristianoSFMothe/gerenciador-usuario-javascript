import { Loader2 } from 'lucide-react'
import { ComponentProps } from 'react'

import { Button } from '@/app/_components/ui/button'
import { cn } from '@/app/_lib/utils'

type AuthenticationButtonProps = ComponentProps<typeof Button> & {
  isSubmitting: boolean
}

const AuthenticationButton = ({
  className,
  children,
  isSubmitting,
  disabled,
  ...props
}: AuthenticationButtonProps) => {
  return (
    <Button
      type='submit'
      disabled={disabled ?? isSubmitting}
      className={cn(
        'flex h-14 w-full items-center justify-center gap-2 rounded-full',
        'bg-[#003d9b] text-sm font-semibold text-white transition-colors',
        'hover:bg-[#003d9b]/90 disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : null}
      {children}
    </Button>
  )
}

export default AuthenticationButton
