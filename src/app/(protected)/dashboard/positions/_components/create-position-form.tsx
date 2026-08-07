'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
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
import type { CompanyOption } from '@/app/(protected)/_actions/companies/get-company-options'

import { createPositionAction } from '../../../_actions/positions/create-position-action'
import { type PositionInput, positionSchema } from '../_schema/position-schema'
import FormSectionCard from './form-section-card'

type CreatePositionFormProps = {
  companies: CompanyOption[]
}

const CreatePositionForm = ({ companies }: CreatePositionFormProps) => {
  const router = useRouter()

  const form = useForm<PositionInput>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      companyId: '',
      title: '',
    },
  })

  const onSubmit = async (data: PositionInput) => {
    const result = await createPositionAction(data)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    form.reset()
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px]'>
          Cadastro de Cargo
        </h1>
        <p className='text-sm text-[#434654]'>
          Preencha os dados abaixo para registrar um novo cargo vinculado a uma
          empresa.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8'
        >
          <FormSectionCard
            icon={Briefcase}
            title='Informações do Cargo'
            contentClassName='grid grid-cols-1 gap-6 sm:grid-cols-2'
          >
            <FormField
              control={form.control}
              name='companyId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Empresa *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione a empresa' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.length === 0 ? (
                        <SelectItem value='none' disabled>
                          Nenhuma empresa cadastrada
                        </SelectItem>
                      ) : (
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.tradeName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Nome do Cargo *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ex: Analista Fiscal Jr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSectionCard>

          <div className='flex justify-end gap-4 border-t border-[#dfe1e6] pt-6'>
            <Button
              type='button'
              variant='outline'
              className='border-[#003d9b] px-8 text-[#003d9b] hover:bg-[#003d9b]/5 hover:text-[#003d9b]'
              onClick={() => router.push('/dashboard/positions')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 hover:bg-[#003d9b]/90'
            >
              Salvar Cargo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreatePositionForm
