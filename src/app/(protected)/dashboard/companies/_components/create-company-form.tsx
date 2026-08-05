'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Globe, Mail, MapPin, Phone, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
import { BRAZIL_STATES } from '@/app/_lib/brazil-states'

import { createCompanyAction } from '../../../_actions/companies/create-company-action'
import { type CompanyInput, companySchema } from '../_schema/company-schema'
import CompanyTextField from './company-text-field'

const CreateCompanyForm = () => {
  const router = useRouter()
  const [sectorInput, setSectorInput] = useState('')

  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
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
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  const sectors = useWatch({ control: form.control, name: 'sectors' }) ?? []

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

  const onSubmit = async (data: CompanyInput) => {
    const result = await createCompanyAction(data)

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
            Cadastro de Empresa
          </h1>
          <p className='text-sm text-[#434654]'>
            Preencha os dados abaixo para registrar uma nova entidade
            corporativa no sistema.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-8'
        >
          <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8'>
            <div className='flex items-center gap-2 border-b border-[#dfe1e6]/50 pb-3'>
              <Building2 className='size-5 text-[#003d9b]' />
              <h2 className='text-lg font-semibold text-[#121d22]'>
                Informações Principais
              </h2>
            </div>

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

              <CompanyTextField
                control={form.control}
                name='cnpj'
                label='CNPJ *'
                placeholder='00.000.000/0000-00'
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

              <FormField
                control={form.control}
                name='foundationDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                      Data de Abertura
                    </FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex flex-col gap-8 sm:flex-row'>
            <div className='flex flex-1 flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8'>
              <div className='flex items-center gap-2 border-b border-[#dfe1e6]/50 pb-3'>
                <Phone className='size-5 text-[#003d9b]' />
                <h2 className='text-lg font-semibold text-[#121d22]'>
                  Contato &amp; Presença
                </h2>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                        Email Corporativo
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#434654]/70' />
                          <Input
                            type='email'
                            placeholder='contato@empresa.com.br'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
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
                      <FormControl>
                        <div className='relative'>
                          <Globe className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#434654]/70' />
                          <Input
                            placeholder='https://www.empresa.com.br'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CompanyTextField
                  control={form.control}
                  name='landlinePhone'
                  label='Telefone Fixo'
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
                <div className='flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border border-[#dfe1e6] bg-[#f3faff] p-2'>
                  {sectors.map((sector) => (
                    <span
                      key={sector}
                      className='flex items-center gap-1 rounded-full border border-[#0052cc]/20 bg-[#0052cc]/10 px-[9px] py-[3px] text-xs font-semibold tracking-[0.6px] text-[#0052cc]'
                    >
                      {sector}
                      <button
                        type='button'
                        onClick={() => removeSector(sector)}
                        aria-label={`Remover ${sector}`}
                      >
                        <X className='size-3' />
                      </button>
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
                    className='min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-[#434654]/50'
                  />
                </div>
                <p className='text-xs text-[#434654]/70'>
                  Pressione &apos;Enter&apos; para adicionar uma nova tag.
                </p>
              </FormItem>
            </div>

            <div className='flex flex-1 flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8'>
              <div className='flex items-center gap-2 border-b border-[#dfe1e6]/50 pb-3'>
                <MapPin className='size-5 text-[#003d9b]' />
                <h2 className='text-lg font-semibold text-[#121d22]'>
                  Endereço (Matriz)
                </h2>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <FormField
                    control={form.control}
                    name='postalCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
                          CEP *
                        </FormLabel>
                        <div className='flex gap-2'>
                          <FormControl>
                            <Input
                              placeholder='00000-000'
                              className='max-w-[160px]'
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type='button'
                            variant='outline'
                            className='shrink-0 gap-1 border-[#003d9b]/20 bg-[#deeaf1] text-[#003d9b] hover:bg-[#deeaf1]/80'
                          >
                            <Search className='size-3.5' />
                            Buscar
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='sm:col-span-2'>
                  <CompanyTextField
                    control={form.control}
                    name='street'
                    label='Logradouro / Endereço *'
                    placeholder='Rua, Avenida, etc.'
                  />
                </div>

                <CompanyTextField
                  control={form.control}
                  name='number'
                  label='Número *'
                  placeholder='S/N'
                />

                <CompanyTextField
                  control={form.control}
                  name='complement'
                  label='Complemento'
                  placeholder='Sala, Andar, etc.'
                />

                <div className='sm:col-span-2'>
                  <CompanyTextField
                    control={form.control}
                    name='neighborhood'
                    label='Bairro *'
                    placeholder='Bairro'
                  />
                </div>

                <CompanyTextField
                  control={form.control}
                  name='city'
                  label='Cidade *'
                  placeholder='Cidade'
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
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
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
              </div>
            </div>
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
              Salvar Empresa
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateCompanyForm
