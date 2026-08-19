'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import DatePickerField from '@/app/_components/date-picker-field'
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
import { Textarea } from '@/app/_components/ui/textarea'
import { BRAZIL_STATES } from '@/app/_lib/brazil-states'
import { GENDER_OPTIONS } from '@/app/_lib/gender-options'
import { cn } from '@/app/_lib/utils'
import { addressInputClassName } from '@/app/_utils/address-input-class-name'
import { calculateAge } from '@/app/_utils/calculate-age'
import { fetchAddressByCEP } from '@/app/_utils/fetch-address-by-cep'
import {
  maskCEP,
  maskCPF,
  maskCurrency,
  maskPhone,
  onlyDigits,
} from '@/app/_utils/masks'
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
  positionDescription: '',
  departmentTypeId: '',
  customDepartmentName: '',
  salary: '',
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
  positionDescription: employee.employmentHistory[0]?.description ?? '',
  departmentTypeId: employee.department.departmentTypeId,
  customDepartmentName: '',
  salary: employee.salary
    ? new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(employee.salary.toNumber())
    : '',
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
      <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px] dark:text-[#f1f5f9]'>
        {isEditMode ? 'Edição de Funcionário' : 'Cadastro de Novo Funcionário'}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8 dark:border-[#1e293b] dark:bg-[#0f172a]'
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
              <DatePickerField
                control={form.control}
                name='birthDate'
                label='Data de Nascimento'
                triggerClassName='w-37.5'
              />

              <FormItem className='w-16 shrink-0'>
                <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                  Idade
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    value={age !== null ? String(age) : ''}
                    className='bg-[#deeaf1] px-2 text-center text-[#434654] disabled:opacity-100 dark:bg-[#1e293b] dark:text-[#94a3b8]'
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>

          <div className='border-t border-[#dfe1e6] dark:border-[#1e293b]' />

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem className='lg:col-span-1'>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                <FormItem className='lg:col-span-2'>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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

            <div className='lg:col-span-3'>
              <EmployeeTextField
                control={form.control}
                name='position'
                label='Cargo'
                placeholder='Digite o cargo'
              />
            </div>

            <div className='lg:col-span-3'>
              <EmployeeTextField
                control={form.control}
                name='salary'
                label='Salário'
                placeholder='0,00'
                mask={maskCurrency}
              />
            </div>

            {isCustomDepartmentType && (
              <FormField
                control={form.control}
                name='customDepartmentName'
                render={({ field }) => (
                  <FormItem className='lg:col-span-3'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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

            <FormField
              control={form.control}
              name='positionDescription'
              render={({ field }) => (
                <FormItem className='lg:col-span-12'>
                  <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                    Descrição do Cargo
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Principais responsabilidades e atribuições do cargo'
                      className='min-h-24 resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col gap-4 border-t border-[#dfe1e6] pt-8 dark:border-[#1e293b]'>
            <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
              Endereço
            </h2>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-12'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem className='sm:col-span-12'>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
                      CEP
                    </FormLabel>
                    <div className='flex flex-wrap items-center gap-3'>
                      <div className='flex gap-2'>
                        <FormControl>
                          <Input
                            placeholder='00000-000'
                            disabled={hasNoPostalCode}
                            className='max-w-40'
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
                          className='shrink-0 border-[#003d9b]/20 bg-[#deeaf1] text-[#003d9b] hover:bg-[#deeaf1]/80 dark:border-[#60a5fa]/20 dark:bg-[#1e293b] dark:text-[#60a5fa] dark:hover:bg-[#1e293b]/80'
                        >
                          {isSearchingCep ? (
                            <Loader2 className='size-3.5 animate-spin' />
                          ) : null}
                          Consultar
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name='hasNoPostalCode'
                        render={({ field: hasNoPostalCodeField }) => (
                          <div className='flex items-center gap-2'>
                            <FormControl>
                              <Checkbox
                                id='has-no-postal-code'
                                checked={hasNoPostalCodeField.value === true}
                                onCheckedChange={(checked) => {
                                  const isChecked = checked === true
                                  hasNoPostalCodeField.onChange(isChecked)
                                  if (isChecked) form.setValue('postalCode', '')
                                }}
                              />
                            </FormControl>
                            <label
                              htmlFor='has-no-postal-code'
                              className='cursor-pointer text-xs whitespace-nowrap text-[#434654] dark:text-[#94a3b8]'
                            >
                              CEP não encontrado
                            </label>
                          </div>
                        )}
                      />
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
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                      className='cursor-pointer text-xs text-[#434654] dark:text-[#94a3b8]'
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
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
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

          <div className='flex justify-end gap-4 border-t border-[#dfe1e6] pt-6 dark:border-[#1e293b]'>
            <Button
              type='button'
              variant='outline'
              className='border-[#003d9b] px-8 text-[#003d9b] hover:bg-[#003d9b]/5 hover:text-[#003d9b] dark:border-[#60a5fa] dark:text-[#60a5fa] dark:hover:bg-[#60a5fa]/10 dark:hover:text-[#60a5fa]'
              onClick={() => router.push('/dashboard/employees')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 text-white hover:bg-[#003d9b]/90'
            >
              {form.formState.isSubmitting ? (
                <Loader2 className='size-3.5 animate-spin' />
              ) : null}
              {isEditMode ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EmployeeForm
