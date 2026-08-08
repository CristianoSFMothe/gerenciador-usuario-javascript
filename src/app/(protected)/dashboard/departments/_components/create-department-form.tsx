'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Network } from 'lucide-react'
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

import { createDepartmentAction } from '../../../_actions/departments/create-department-action'
import {
  type DepartmentInput,
  departmentSchema,
} from '../_schema/department-schema'
import FormSectionCard from './form-section-card'

type CreateDepartmentFormProps = {
  companies: CompanyOption[]
}

const CreateDepartmentForm = ({ companies }: CreateDepartmentFormProps) => {
  const router = useRouter()

  const form = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      companyId: '',
      name: '',
    },
  })

  const onSubmit = async (data: DepartmentInput) => {
    const result = await createDepartmentAction(data)

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
          Cadastro de Departamento
        </h1>
        <p className='text-sm text-[#434654]'>
          Preencha os dados abaixo para registrar um novo departamento vinculado
          a uma empresa.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8'
        >
          <FormSectionCard
            icon={Network}
            title='Informações do Departamento'
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Nome do Departamento *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ex: Recursos Humanos' {...field} />
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
              onClick={() => router.push('/dashboard/departments')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 hover:bg-[#003d9b]/90'
            >
              Salvar Departamento
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateDepartmentForm
