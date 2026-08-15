'use client'

import { Loader2, Trash2 } from 'lucide-react'
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

import { deleteCompanyAction } from '../../../_actions/companies/delete-company-action'
import type { CompanyListItem } from '../../../_actions/companies/get-companies'

type DeleteCompanyDialogProps = {
  company: CompanyListItem
}

const describeDependents = (company: CompanyListItem) => {
  const parts: string[] = []

  if (company._count.employees > 0) {
    parts.push(`${company._count.employees} funcionário(s)`)
  }
  if (company._count.departments > 0) {
    parts.push(`${company._count.departments} departamento(s)`)
  }

  return parts.join(', ')
}

const DeleteCompanyDialog = ({ company }: DeleteCompanyDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const hasDependents =
    company._count.employees > 0 || company._count.departments > 0

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteCompanyAction(company.id)
    setIsDeleting(false)

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
          title='Excluir empresa'
          aria-label='Excluir empresa'
          className='p-1 text-[#434654] hover:text-red-600'
        >
          <Trash2 className='size-3.5' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir empresa</DialogTitle>
          <DialogDescription>
            {hasDependents ? (
              <>
                A empresa <strong>{company.tradeName}</strong> possui{' '}
                {describeDependents(company)} vinculado(s) a ela. Ela não será
                excluída, apenas marcada como inativa. Deseja continuar?
              </>
            ) : (
              <>
                Tem certeza que deseja excluir a empresa{' '}
                <strong>{company.tradeName}</strong>? Essa ação não pode ser
                desfeita.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isDeleting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type='button'
            variant='destructive'
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting && <Loader2 className='size-3.5 animate-spin' />}
            {hasDependents ? 'Marcar como inativa' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCompanyDialog
