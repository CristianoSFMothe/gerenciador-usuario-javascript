'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import { Calendar } from '@/app/_components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/ui/popover'
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
import type { CompanyOption } from '@/app/(protected)/_actions/companies/get-company-options'
import { OTHER_DEPARTMENT_TYPE_VALUE } from '@/app/(protected)/_actions/departments/department-type-constants'
import type { DepartmentTypeOption } from '@/app/(protected)/_actions/departments/get-department-types'

import { createEmployeeAction } from '../../../_actions/employees/create-employee-action'
import type { EmployeeDetail } from '../../../_actions/employees/get-employee'
import { updateEmployeeAction } from '../../../_actions/employees/update-employee-action'
import { type EmployeeInput, employeeSchema } from '../_schema/employee-schema'
import EmployeeTextField from './employee-text-field'

const EMPTY_DEFAULT_VALUES: Partial<EmployeeInput> = {
  firstName: '',
  lastName: '',
  phone: '',
  cpf: '',
  email: '',
  birthDate: '',
  position: '',
  departmentTypeId: '',
  customDepartmentName: '',
  postalCode: '',
  hasNoPostalCode: false,
  street: '',
  streetNumber: '',
  hasNoStreetNumber: false,
  neighborhood: '',
  city: '',
  state: '',
}

const buildDefaultValues = (employee: EmployeeDetail): EmployeeInput => ({
  firstName: employee.firstName,
  lastName: employee.lastName,
  phone: maskPhone(employee.phone),
  cpf: maskCPF(employee.cpf),
  email: employee.email,
  birthDate: employee.birthDate.toISOString().slice(0, 10),
  gender: employee.gender,
  companyId: employee.companyId,
  position: employee.position,
  departmentTypeId: employee.department.departmentTypeId,
  customDepartmentName: '',
  postalCode: maskCEP(employee.postalCode),
  hasNoPostalCode: false,
  street: employee.street,
  streetNumber: employee.streetNumber ?? '',
  hasNoStreetNumber: !employee.streetNumber,
  neighborhood: employee.neighborhood,
  city: employee.city,
  state: employee.state,
})

type EmployeeFormProps = {
  companies: CompanyOption[]
  departmentTypes: DepartmentTypeOption[]
  employee?: EmployeeDetail
}

const EmployeeForm = ({
  companies,
  departmentTypes,
  employee,
}: EmployeeFormProps) => {
  const router = useRouter()
  const isEditMode = Boolean(employee)
  const [isSearchingCep, setIsSearchingCep] = useState(false)

  const form = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? buildDefaultValues(employee)
      : EMPTY_DEFAULT_VALUES,
  })

  const birthDate = useWatch({ control: form.control, name: 'birthDate' })
  const age = calculateAge(birthDate)
  const hasNoStreetNumber = useWatch({
    control: form.control,
    name: 'hasNoStreetNumber',
  })
  const hasNoPostalCode = useWatch({
    control: form.control,
    name: 'hasNoPostalCode',
  })
  const departmentTypeId = useWatch({
    control: form.control,
    name: 'departmentTypeId',
  })
  const isCustomDepartmentType =
    departmentTypeId === OTHER_DEPARTMENT_TYPE_VALUE

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
    const result = employee
      ? await updateEmployeeAction(employee.id, data)
      : await createEmployeeAction(data)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    router.push('/dashboard/employees')
  }

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px]'>
        {isEditMode ? 'Edição de Funcionário' : 'Cadastro de Novo Funcionário'}
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
                render={({ field }) => {
                  const selectedDate = field.value
                    ? parse(field.value, 'yyyy-MM-dd', new Date())
                    : undefined

                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                        Data de Nascimento
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              className={cn(
                                'w-37.5 justify-start gap-2 font-normal',
                                !field.value && 'text-[#434654]/50',
                              )}
                            >
                              <CalendarIcon className='size-3.5' />
                              {selectedDate
                                ? format(selectedDate, 'dd/MM/yyyy')
                                : 'Selecione'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={selectedDate}
                            defaultMonth={selectedDate}
                            disabled={{ after: new Date() }}
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : '',
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem className='lg:col-span-2'>
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
                      <SelectItem value='placeholder' disabled>
                        Selecione
                      </SelectItem>
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
                <FormItem className='lg:col-span-3'>
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
                      {companies.length === 0 ? (
                        <SelectItem value='none' disabled>
                          Nenhuma empresa cadastrada
                        </SelectItem>
                      ) : (
                        <>
                          <SelectItem value='placeholder' disabled>
                            Selecione a empresa
                          </SelectItem>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.tradeName}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='departmentTypeId'
              render={({ field }) => (
                <FormItem className='lg:col-span-3'>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                    Departamento
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione o departamento' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='placeholder' disabled>
                        Selecione o departamento
                      </SelectItem>
                      {departmentTypes.map((departmentType) => (
                        <SelectItem
                          key={departmentType.id}
                          value={departmentType.id}
                        >
                          {departmentType.name}
                        </SelectItem>
                      ))}
                      <SelectItem value={OTHER_DEPARTMENT_TYPE_VALUE}>
                        Outro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='lg:col-span-4'>
              <EmployeeTextField
                control={form.control}
                name='position'
                label='Cargo'
                placeholder='Digite o cargo'
              />
            </div>

            {isCustomDepartmentType && (
              <FormField
                control={form.control}
                name='customDepartmentName'
                render={({ field }) => (
                  <FormItem className='lg:col-span-3'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Nome do Departamento
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Ex: Sustentabilidade' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                          disabled={hasNoPostalCode}
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
                        disabled={hasNoPostalCode || isSearchingCep}
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
                        disabled={!hasNoPostalCode}
                        placeholder={
                          hasNoPostalCode
                            ? 'Digite o logradouro'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!hasNoPostalCode)}
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

              <FormField
                control={form.control}
                name='hasNoPostalCode'
                render={({ field }) => (
                  <div className='flex items-center gap-2 sm:col-span-9'>
                    <FormControl>
                      <Checkbox
                        id='has-no-postal-code'
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          const isChecked = checked === true
                          field.onChange(isChecked)
                          if (isChecked) form.setValue('postalCode', '')
                        }}
                      />
                    </FormControl>
                    <label
                      htmlFor='has-no-postal-code'
                      className='cursor-pointer text-xs text-[#434654]'
                    >
                      CEP não encontrado
                    </label>
                  </div>
                )}
              />

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
                        disabled={!hasNoPostalCode}
                        placeholder={
                          hasNoPostalCode
                            ? 'Digite o bairro'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!hasNoPostalCode)}
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
                        disabled={!hasNoPostalCode}
                        placeholder={
                          hasNoPostalCode
                            ? 'Digite a cidade'
                            : 'Preenchido automaticamente'
                        }
                        className={addressInputClassName(!hasNoPostalCode)}
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
                      disabled={!hasNoPostalCode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            addressInputClassName(!hasNoPostalCode),
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
              onClick={() => router.push('/dashboard/employees')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 hover:bg-[#003d9b]/90'
            >
              {isEditMode ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EmployeeForm
