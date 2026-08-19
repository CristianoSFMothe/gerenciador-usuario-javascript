'use client'

import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import { Textarea } from '@/app/_components/ui/textarea'
import { createEmployeeNoteAction } from '@/app/(protected)/_actions/employees/create-employee-note-action'

import {
  EMPLOYEE_NOTE_TYPE_LABEL,
  type EmployeeNoteTypeValue,
} from '../_lib/employee-note-type'

type NoteFormValues = {
  type: EmployeeNoteTypeValue
  content: string
}

const DEFAULT_VALUES: NoteFormValues = { type: 'FEEDBACK', content: '' }

type AddEmployeeNoteDialogProps = {
  employeeId: string
}

const AddEmployeeNoteDialog = ({ employeeId }: AddEmployeeNoteDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<NoteFormValues>({ defaultValues: DEFAULT_VALUES })

  const onSubmit = async (data: NoteFormValues) => {
    const result = await createEmployeeNoteAction({ employeeId, ...data })

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    form.reset(DEFAULT_VALUES)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='border-[#003d9b] text-[#003d9b] hover:bg-[#003d9b]/5 dark:border-[#60a5fa] dark:text-[#60a5fa] dark:hover:bg-[#60a5fa]/10'
        >
          <Plus className='size-3.5' />
          Nova nota
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova nota</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                    Tipo
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(EMPLOYEE_NOTE_TYPE_LABEL).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              rules={{ required: 'Escreva o conteúdo da nota.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                    Conteúdo
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Escreva a nota...'
                      className='min-h-24'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='bg-[#003d9b] text-white hover:bg-[#003d9b]/90'
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : null}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEmployeeNoteDialog
