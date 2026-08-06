import { z } from 'zod'

const websiteSchema = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value ? `https://${value}` : value))
  .pipe(z.union([z.literal(''), z.url('Informe uma URL válida.')]))

export const companySchema = z
  .object({
    corporateName: z.string().min(1, 'Informe a razão social.'),
    tradeName: z.string().min(1, 'Informe o nome fantasia.'),
    cnpj: z.string().min(1, 'Informe o CNPJ.'),
    stateRegistration: z.string().optional(),
    municipalRegistration: z.string().optional(),
    foundationDate: z.string().min(1, 'Informe a data de abertura.'),
    email: z.email('Informe um e-mail válido.').min(1, 'Informe o e-mail.'),
    website: websiteSchema,
    landlinePhone: z.string().min(1, 'Informe o telefone fixo.'),
    mobilePhone: z.string().optional(),
    sectors: z.array(z.string()).optional(),
    postalCode: z.string().optional(),
    hasNoPostalCode: z.boolean().optional(),
    street: z.string().min(1, 'Informe o logradouro.'),
    number: z.string().optional(),
    hasNoStreetNumber: z.boolean().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Informe o bairro.'),
    city: z.string().min(1, 'Informe a cidade.'),
    state: z.string().min(1, 'Selecione o estado.'),
  })
  .refine(
    (data) => data.hasNoStreetNumber === true || Boolean(data.number?.trim()),
    {
      message: 'Informe o número ou marque "Sem número".',
      path: ['number'],
    },
  )
  .refine(
    (data) => data.hasNoPostalCode === true || Boolean(data.postalCode?.trim()),
    {
      message: 'Informe o CEP ou marque "Não sei o CEP".',
      path: ['postalCode'],
    },
  )

export type CompanyInput = z.infer<typeof companySchema>
