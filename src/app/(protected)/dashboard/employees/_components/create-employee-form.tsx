'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { BRAZIL_STATES } from '@/app/_lib/brazil-states'
import { GENDER_OPTIONS } from '@/app/_lib/gender-options'
import { cn } from '@/app/_lib/utils'
import { addressInputClassName } from '@/app/_utils/address-input-class-name'
import { calculateAge } from '@/app/_utils/calculate-age'
import { fetchAddressByCEP } from '@/app/_utils/fetch-address-by-cep'
import { maskCEP, maskCPF, maskPhone, onlyDigits } from '@/app/_utils/masks'

import { createEmployeeAction } from '../../../_actions/employees/create-employee-action'
import { type EmployeeInput, employeeSchema } from '../_schema/employee-schema'
import EmployeeTextField from './employee-text-field'

const CreateEmployeeForm = () => {
  const router = useRouter()
  const [manualAddress, setManualAddress] = useState(false)
  const [isSearchingCep, setIsSearchingCep] = useState(false)

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
      streetNumber: '',
      hasNoStreetNumber: false,
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  const birthDate = useWatch({ control: form.control, name: 'birthDate' })
  const age = calculateAge(birthDate)
  const hasNoStreetNumber = useWatch({
    control: form.control,
    name: 'hasNoStreetNumber',
  })

  const searchCep = async () => {
    const postalCode = form.getValues('postalCode') ?? ''

    if (onlyDigits(postalCode).length !== 8) {
      toast.error('Informe um CEP válido com 8 dígitos.')
      return
    }

    setIsSearchingCep(true)

    const result = await fetchAddressByCEP(postalCode)

    setIsSearchingCep(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    const fillOptions = { shouldValidate: true, shouldDirty: true }
    form.setValue('street', result.address.street, fillOptions)
    form.setValue('neighborhood', result.address.neighborhood, fillOptions)
    form.setValue('city', result.address.city, fillOptions)
    form.setValue('state', result.address.state, fillOptions)
  }

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
        Cadastro de Novo Funcionário
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8'
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <EmployeeTextField
              control={form.control}
              name='firstName'
              label='Nome'
              placeholder='Digite o nome'
            />

            <EmployeeTextField
              control={form.control}
              name='lastName'
              label='Sobrenome'
              placeholder='Digite o sobrenome'
            />

            <EmployeeTextField
              control={form.control}
              name='phone'
              label='Telefone'
              placeholder='(00) 00000-0000'
              mask={maskPhone}
            />

            <EmployeeTextField
              control={form.control}
              name='cpf'
              label='CPF'
              placeholder='000.000.000-00'
              mask={maskCPF}
            />

            <EmployeeTextField
              control={form.control}
              name='email'
              label='Email'
              placeholder='exemplo@email.com'
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
                          onChange={(event) =>
                            field.onChange(maskCEP(event.target.value))
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              searchCep()
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={manualAddress || isSearchingCep}
                        onClick={searchCep}
                        className='shrink-0 border-[#003d9b]/20 bg-[#deeaf1] text-[#003d9b] hover:bg-[#deeaf1]/80'
                      >
                        {isSearchingCep ? (
                          <Loader2 className='size-3.5 animate-spin' />
                        ) : null}
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
                  <FormItem className='sm:col-span-5'>
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

              <FormField
                control={form.control}
                name='streetNumber'
                render={({ field }) => (
                  <FormItem className='sm:col-span-3'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Número
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={hasNoStreetNumber}
                        placeholder='Nº'
                        className={addressInputClassName(
                          hasNoStreetNumber === true,
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2 sm:col-span-9'>
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
                name='hasNoStreetNumber'
                render={({ field }) => (
                  <div className='flex items-center gap-2 sm:col-span-3'>
                    <FormControl>
                      <Checkbox
                        id='no-street-number'
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          const isChecked = checked === true
                          field.onChange(isChecked)
                          if (isChecked) form.setValue('streetNumber', '')
                        }}
                      />
                    </FormControl>
                    <label
                      htmlFor='no-street-number'
                      className='cursor-pointer text-xs text-[#434654]'
                    >
                      Sem número
                    </label>
                  </div>
                )}
              />

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
                    <Select
                      disabled={!manualAddress}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            addressInputClassName(!manualAddress),
                          )}
                        >
                          <SelectValue placeholder='UF' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZIL_STATES.map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
