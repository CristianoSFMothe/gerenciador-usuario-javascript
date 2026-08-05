'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import { Checkbox } from '@/app/_components/ui/checkbox'
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
import { cn } from '@/app/_lib/utils'

import { createEmployeeAction } from '../_actions/employees/create-employee-action'
import { type EmployeeInput, employeeSchema } from '../_schema/employee-schema'

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Feminino' },
  { value: 'OTHER', label: 'Outro' },
] as const

const calculateAge = (birthDate: string) => {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) age -= 1

  return age
}

const addressInputClassName = (locked: boolean) =>
  cn(locked && 'bg-[#deeaf1]', 'disabled:opacity-100')

const CreateEmployeeForm = () => {
  const router = useRouter()
  const [manualAddress, setManualAddress] = useState(false)

  const form = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      cpf: '',
      email: '',
      birthDate: '',
      postalCode: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  const birthDate = useWatch({ control: form.control, name: 'birthDate' })
  const age = calculateAge(birthDate)

  const onSubmit = async (data: EmployeeInput) => {
    const result = await createEmployeeAction(data)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    router.push('/dashboard/users')
  }

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px]'>
        Cadastro de Nova Pessoa
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8'
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Digite o nome' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Sobrenome
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Digite o sobrenome' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='(00) 00000-0000' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cpf'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    CPF
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='000.000.000-00' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='exemplo@email.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Data de Nascimento
                    </FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='w-16 shrink-0'>
                <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                  Idade
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    value={age !== null ? String(age) : ''}
                    className='bg-[#deeaf1] px-2 text-center text-[#434654] disabled:opacity-100'
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>

          <div className='border-t border-[#dfe1e6]' />

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Sexo
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='companyId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Empresa
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione a empresa' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none' disabled>
                        Nenhuma empresa cadastrada
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='positionId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Cargo
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione o cargo' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none' disabled>
                        Nenhum cargo cadastrado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col gap-4 border-t border-[#dfe1e6] pt-8'>
            <h2 className='text-lg font-semibold text-[#121d22]'>Endereço</h2>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-12'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem className='sm:col-span-4'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      CEP
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          placeholder='00000-000'
                          disabled={manualAddress}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={manualAddress}
                        className='shrink-0 border-[#003d9b]/20 bg-[#deeaf1] text-[#003d9b] hover:bg-[#deeaf1]/80'
                      >
                        Consultar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='street'
                render={({ field }) => (
                  <FormItem className='sm:col-span-8'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Logradouro
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!manualAddress}
                        placeholder={
                          manualAddress
                            ? 'Digite o logradouro'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!manualAddress)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2 sm:col-span-12'>
                <Checkbox
                  id='manual-address'
                  checked={manualAddress}
                  onCheckedChange={(checked) =>
                    setManualAddress(checked === true)
                  }
                />
                <label
                  htmlFor='manual-address'
                  className='cursor-pointer text-xs text-[#434654]'
                >
                  Não sei o CEP
                </label>
              </div>

              <FormField
                control={form.control}
                name='neighborhood'
                render={({ field }) => (
                  <FormItem className='sm:col-span-5'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Bairro
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!manualAddress}
                        placeholder={
                          manualAddress
                            ? 'Digite o bairro'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!manualAddress)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem className='sm:col-span-5'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Cidade
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!manualAddress}
                        placeholder={
                          manualAddress
                            ? 'Digite a cidade'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!manualAddress)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Estado
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!manualAddress}
                        placeholder='UF'
                        className={addressInputClassName(!manualAddress)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex justify-end gap-4 border-t border-[#dfe1e6] pt-6'>
            <Button
              type='button'
              variant='outline'
              className='border-[#003d9b] px-8 text-[#003d9b] hover:bg-[#003d9b]/5 hover:text-[#003d9b]'
              onClick={() => router.push('/dashboard/users')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 hover:bg-[#003d9b]/90'
            >
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateEmployeeForm
