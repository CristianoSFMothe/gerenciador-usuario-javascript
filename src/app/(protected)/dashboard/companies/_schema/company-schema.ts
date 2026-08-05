import { z } from 'zod'

export const companySchema = z.object({
  corporateName: z.string().min(1, 'Informe a razão social.'),
  tradeName: z.string().min(1, 'Informe o nome fantasia.'),
  cnpj: z.string().min(1, 'Informe o CNPJ.'),
  stateRegistration: z.string().optional(),
  municipalRegistration: z.string().optional(),
  foundationDate: z.string().optional(),
  email: z.email('Informe um e-mail válido.').optional().or(z.literal('')),
  website: z.url('Informe uma URL válida.').optional().or(z.literal('')),
  landlinePhone: z.string().optional(),
  mobilePhone: z.string().optional(),
  sectors: z.array(z.string()).optional(),
  postalCode: z.string().min(1, 'Informe o CEP.'),
  street: z.string().min(1, 'Informe o logradouro.'),
  number: z.string().min(1, 'Informe o número.'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Informe o bairro.'),
  city: z.string().min(1, 'Informe a cidade.'),
  state: z.string().min(1, 'Selecione o estado.'),
})

export type CompanyInput = z.infer<typeof companySchema>
