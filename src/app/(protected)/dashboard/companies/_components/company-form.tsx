'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import DatePickerField from '@/app/_components/date-picker-field'
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
import { BRAZIL_STATES } from '@/app/_lib/brazil-states'
import { cn } from '@/app/_lib/utils'
import { addressInputClassName } from '@/app/_utils/address-input-class-name'
import { fetchAddressByCEP } from '@/app/_utils/fetch-address-by-cep'
import { maskCEP, maskCNPJ, maskPhone, onlyDigits } from '@/app/_utils/masks'

import { createCompanyAction } from '../../../_actions/companies/create-company-action'
import type { CompanyDetail } from '../../../_actions/companies/get-company'
import { updateCompanyAction } from '../../../_actions/companies/update-company-action'
import { type CompanyInput, companySchema } from '../_schema/company-schema'
import AutoFillAddressField from './auto-fill-address-field'
import CompanyTextField from './company-text-field'
import FormCheckboxField from './form-checkbox-field'
import FormSectionCard from './form-section-card'

const EMPTY_DEFAULT_VALUES: CompanyInput = {
  corporateName: '',
  tradeName: '',
  cnpj: '',
  stateRegistration: '',
  municipalRegistration: '',
  foundationDate: '',
  email: '',
  website: '',
  landlinePhone: '',
  mobilePhone: '',
  sectors: [],
  postalCode: '',
  hasNoPostalCode: false,
  street: '',
  number: '',
  hasNoStreetNumber: false,
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

const buildDefaultValues = (company: CompanyDetail): CompanyInput => ({
  corporateName: company.legalName,
  tradeName: company.tradeName,
  cnpj: maskCNPJ(company.cnpj),
  stateRegistration: company.stateRegistration ?? '',
  municipalRegistration: company.municipalRegistration ?? '',
  foundationDate: company.foundedAt.toISOString().slice(0, 10),
  email: company.email,
  website: company.website?.replace(/^https:\/\//, '') ?? '',
  landlinePhone: maskPhone(company.landlinePhone),
  mobilePhone: company.mobilePhone ? maskPhone(company.mobilePhone) : '',
  sectors: company.sectors,
  postalCode: company.postalCode ? maskCEP(company.postalCode) : '',
  hasNoPostalCode: !company.postalCode,
  street: company.street,
  number: company.streetNumber ?? '',
  hasNoStreetNumber: !company.streetNumber,
  complement: company.complement ?? '',
  neighborhood: company.neighborhood,
  city: company.city,
  state: company.state,
})

type CompanyFormProps = {
  company?: CompanyDetail
}

const CompanyForm = ({ company }: CompanyFormProps) => {
  const router = useRouter()
  const isEditMode = Boolean(company)
  const [sectorInput, setSectorInput] = useState('')
  const [isSearchingCep, setIsSearchingCep] = useState(false)

  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: company ? buildDefaultValues(company) : EMPTY_DEFAULT_VALUES,
  })

  const sectors = useWatch({ control: form.control, name: 'sectors' }) ?? []
  const hasNoStreetNumber = useWatch({
    control: form.control,
    name: 'hasNoStreetNumber',
  })
  const manualAddress = useWatch({
    control: form.control,
    name: 'hasNoPostalCode',
  })

  const addSector = () => {
    const trimmed = sectorInput.trim()
    if (!trimmed || sectors.includes(trimmed)) return

    form.setValue('sectors', [...sectors, trimmed], { shouldDirty: true })
    setSectorInput('')
  }

  const removeSector = (sector: string) => {
    form.setValue(
      'sectors',
      sectors.filter((item) => item !== sector),
      { shouldDirty: true },
    )
  }

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

  const onSubmit = async (data: CompanyInput) => {
    const result = company
      ? await updateCompanyAction(company.id, data)
      : await createCompanyAction(data)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    router.push('/dashboard/companies')
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px]'>
            {isEditMode ? 'Edição de Empresa' : 'Cadastro de Empresa'}
          </h1>
          <p className='text-sm text-[#434654]'>
            {isEditMode
              ? 'Atualize os dados da entidade corporativa selecionada.'
              : 'Preencha os dados abaixo para registrar uma nova entidade corporativa no sistema.'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8'
        >
          <FormSectionCard
            icon={Building2}
            title='Informações Principais'
            contentClassName='flex flex-col gap-6'
          >
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='sm:col-span-2'>
                <CompanyTextField
                  control={form.control}
                  name='corporateName'
                  label='Razão Social *'
                  placeholder='Ex: Acme Corporação LTDA'
                />
              </div>

              <CompanyTextField
                control={form.control}
                name='tradeName'
                label='Nome Fantasia *'
                placeholder='Ex: Acme'
              />
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-4'>
              <CompanyTextField
                control={form.control}
                name='cnpj'
                label='CNPJ *'
                placeholder='00.000.000/0000-00'
                mask={maskCNPJ}
              />

              <CompanyTextField
                control={form.control}
                name='stateRegistration'
                label='Inscrição Estadual (IE)'
                placeholder='Opcional'
              />

              <CompanyTextField
                control={form.control}
                name='municipalRegistration'
                label='Inscrição Municipal (IM)'
                placeholder='Opcional'
              />

              <DatePickerField
                control={form.control}
                name='foundationDate'
                label='Data de Abertura *'
              />
            </div>
          </FormSectionCard>

          <div className='flex flex-col gap-8 sm:flex-row'>
            <FormSectionCard
              icon={Phone}
              title='Contato & Presença'
              className='flex-1'
              contentClassName='flex flex-col gap-4'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                        Email Corporativo *
                      </FormLabel>
                      <div className='relative'>
                        <Mail className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#434654]/70' />
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='contato@empresa.com.br'
                            className='pl-9'
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                        Site Institucional
                      </FormLabel>
                      <div className='relative'>
                        <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#434654]/70'>
                          https://
                        </span>
                        <FormControl>
                          <Input
                            placeholder='www.empresa.com.br'
                            className='pl-16'
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CompanyTextField
                  control={form.control}
                  name='landlinePhone'
                  label='Telefone Fixo *'
                  placeholder='(00) 0000-0000'
                />

                <CompanyTextField
                  control={form.control}
                  name='mobilePhone'
                  label='Telefone Celular'
                  placeholder='(00) 90000-0000'
                />
              </div>

              <FormItem>
                <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                  Setores / Áreas de Atuação
                </FormLabel>
                <div className='flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-[#dfe1e6] bg-[#f3faff] p-2'>
                  {sectors.map((sector) => (
                    <span
                      key={sector}
                      className={cn(
                        'flex items-center gap-1 rounded-full border',
                        'border-[#0052cc]/20 bg-[#0052cc]/10 px-2.25 py-0.75',
                        'text-xs font-semibold tracking-[0.6px] text-[#0052cc]',
                      )}
                    >
                      {sector}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-xs'
                        className='size-3 rounded-full p-0 hover:bg-transparent'
                        onClick={() => removeSector(sector)}
                        aria-label={`Remover ${sector}`}
                      >
                        <X className='size-3' />
                      </Button>
                    </span>
                  ))}
                  <input
                    value={sectorInput}
                    onChange={(event) => setSectorInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addSector()
                      }
                    }}
                    placeholder='Adicionar área...'
                    className='min-w-30 flex-1 bg-transparent text-sm outline-none placeholder:text-[#434654]/50'
                  />
                </div>
                <p className='text-xs text-[#434654]/70'>
                  Pressione &apos;Enter&apos; para adicionar uma nova tag.
                </p>
              </FormItem>
            </FormSectionCard>

            <FormSectionCard
              icon={MapPin}
              title='Endereço (Matriz)'
              className='flex-1'
              contentClassName='grid grid-cols-1 gap-4 sm:grid-cols-2'
            >
              <div className='sm:col-span-2'>
                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                        CEP *
                      </FormLabel>
                      <div className='flex flex-wrap items-center gap-3'>
                        <div className='flex gap-2'>
                          <FormControl>
                            <Input
                              placeholder='00000-000'
                              className='max-w-40'
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
                            className='shrink-0 gap-1 border-[#003d9b]/20 bg-[#deeaf1] text-[#003d9b] hover:bg-[#deeaf1]/80'
                          >
                            {isSearchingCep ? (
                              <Loader2 className='size-3.5 animate-spin' />
                            ) : (
                              <Search className='size-3.5' />
                            )}
                            Buscar
                          </Button>
                        </div>

                        <FormCheckboxField
                          control={form.control}
                          name='hasNoPostalCode'
                          label='CEP não encontrado'
                          onCheckedChange={(checked) => {
                            if (checked) form.setValue('postalCode', '')
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='sm:col-span-2'>
                <AutoFillAddressField
                  control={form.control}
                  name='street'
                  label='Logradouro / Endereço *'
                  placeholder='Rua, Avenida, etc.'
                  locked={!manualAddress}
                />
              </div>

              <FormField
                control={form.control}
                name='number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Número *
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={hasNoStreetNumber}
                        placeholder='S/N'
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

              <CompanyTextField
                control={form.control}
                name='complement'
                label='Complemento'
                placeholder='Sala, Andar, etc.'
              />

              <FormCheckboxField
                control={form.control}
                name='hasNoStreetNumber'
                label='Sem número'
                onCheckedChange={(checked) => {
                  if (checked) form.setValue('number', '')
                }}
              />

              <div className='sm:col-span-2'>
                <AutoFillAddressField
                  control={form.control}
                  name='neighborhood'
                  label='Bairro *'
                  placeholder='Bairro'
                  locked={!manualAddress}
                />
              </div>

              <AutoFillAddressField
                control={form.control}
                name='city'
                label='Cidade *'
                placeholder='Cidade'
                locked={!manualAddress}
              />

              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Estado (UF) *
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
                          <SelectValue placeholder='Selecione...' />
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
            </FormSectionCard>
          </div>

          <div className='flex justify-end gap-4 border-t border-[#dfe1e6] pt-6'>
            <Button
              type='button'
              variant='outline'
              className='border-[#003d9b] px-8 text-[#003d9b] hover:bg-[#003d9b]/5 hover:text-[#003d9b]'
              onClick={() => router.push('/dashboard/companies')}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='bg-[#003d9b] px-8 hover:bg-[#003d9b]/90'
            >
              {isEditMode ? 'Salvar Alterações' : 'Salvar Empresa'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CompanyForm
