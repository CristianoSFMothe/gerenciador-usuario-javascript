'use client'

import { Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'

import { activateEmployeeAction } from '../../../_actions/employees/activate-employee-action'
import { deleteEmployeeAction } from '../../../_actions/employees/delete-employee-action'
import type { EmployeeListItem } from '../../../_actions/employees/get-employees'

type EmployeeStatusDialogProps = {
  employee: EmployeeListItem
}

const EmployeeStatusDialog = ({ employee }: EmployeeStatusDialogProps) => {
  const router = useRouter()
  const isActive = employee.status === 'ACTIVE'
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const employeeName = `${employee.firstName} ${employee.lastName}`

  const handleConfirm = async () => {
    setIsSubmitting(true)
    const result = isActive
      ? await deleteEmployeeAction(employee.id)
      : await activateEmployeeAction(employee.id)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon-xs'
          title={isActive ? 'Excluir funcionário' : 'Ativar funcionário'}
          aria-label={isActive ? 'Excluir funcionário' : 'Ativar funcionário'}
          className={
            isActive
              ? 'p-1 text-[#434654] hover:text-red-600'
              : 'p-1 text-[#434654] hover:text-emerald-600'
          }
        >
          {isActive ? (
            <Trash2 className='size-3.5' />
          ) : (
            <RotateCcw className='size-3.5' />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isActive ? 'Excluir funcionário' : 'Ativar funcionário'}
          </DialogTitle>
          <DialogDescription>
            {isActive ? (
              <>
                Tem certeza que deseja excluir <strong>{employeeName}</strong>?
                O funcionário será marcado como inativo, mas seu cadastro não
                será removido do sistema.
              </>
            ) : (
              <>
                Tem certeza que deseja ativar <strong>{employeeName}</strong>{' '}
                novamente?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isSubmitting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type='button'
            variant={isActive ? 'destructive' : 'default'}
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting && <Loader2 className='size-3.5 animate-spin' />}
            {isActive ? 'Excluir' : 'Ativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeStatusDialog
