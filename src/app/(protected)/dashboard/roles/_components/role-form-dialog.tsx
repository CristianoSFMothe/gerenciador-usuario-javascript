'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import { createRoleAction } from '@/app/(protected)/_actions/roles/create-role-action'
import type { RoleListItem } from '@/app/(protected)/_actions/roles/get-roles'
import { updateRoleAction } from '@/app/(protected)/_actions/roles/update-role-action'

import { type RoleInput, roleSchema } from '../_schema/role-schema'

const EMPTY_DEFAULT_VALUES: RoleInput = {
  name: '',
  description: '',
  status: 'ACTIVE',
}

const buildDefaultValues = (role: RoleListItem): RoleInput => ({
  name: role.name,
  description: role.description,
  status: role.status,
})

type RoleFormDialogProps = {
  role?: RoleListItem
  trigger: ReactNode
}

const RoleFormDialog = ({ role, trigger }: RoleFormDialogProps) => {
  const router = useRouter()
  const isEditMode = Boolean(role)
  const [open, setOpen] = useState(false)

  const form = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: role ? buildDefaultValues(role) : EMPTY_DEFAULT_VALUES,
  })

  useEffect(() => {
    if (!open) return

    form.reset(role ? buildDefaultValues(role) : EMPTY_DEFAULT_VALUES)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync when the dialog opens, not on every role/form identity change
  }, [open])

  const onSubmit = async (data: RoleInput) => {
    const result = role
      ? await updateRoleAction(role.id, data)
      : await createRoleAction(data)

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
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Função' : 'Nova Função'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Atualize o nome, a descrição e o status da função.'
              : 'Crie uma nova função de acesso ao sistema.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ex: Supervisor' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Descreva o escopo de acesso desta função'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditMode ? (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ACTIVE'>Ativo</SelectItem>
                        <SelectItem value='INACTIVE'>Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='bg-[#003d9b] text-white hover:bg-[#003d9b]/90'
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : null}
                {isEditMode ? 'Salvar' : 'Criar Função'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default RoleFormDialog
