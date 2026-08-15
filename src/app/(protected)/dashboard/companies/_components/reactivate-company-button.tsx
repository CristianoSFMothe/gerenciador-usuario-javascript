'use client'

import { Loader2, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'

import { reactivateCompanyAction } from '../../../_actions/companies/reactivate-company-action'

type ReactivateCompanyButtonProps = {
  companyId: string
}

const ReactivateCompanyButton = ({
  companyId,
}: ReactivateCompanyButtonProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReactivate = async () => {
    setIsSubmitting(true)
    const result = await reactivateCompanyAction(companyId)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    router.refresh()
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon-xs'
      title='Reativar empresa'
      aria-label='Reativar empresa'
      className='p-1 text-[#434654] hover:text-emerald-600'
      disabled={isSubmitting}
      onClick={handleReactivate}
    >
      {isSubmitting ? (
        <Loader2 className='size-3.5 animate-spin' />
      ) : (
        <RotateCcw className='size-3.5' />
      )}
    </Button>
  )
}

export default ReactivateCompanyButton
