import { z } from 'zod'

export const employeeSchema = z
  .object({
    firstName: z.string().min(1, 'Informe o nome.'),
    lastName: z.string().min(1, 'Informe o sobrenome.'),
    phone: z.string().min(1, 'Informe o telefone.'),
    cpf: z.string().min(1, 'Informe o CPF.'),
    email: z.email('Informe um e-mail válido.').min(1, 'Informe o e-mail.'),
    birthDate: z.string().min(1, 'Informe a data de nascimento.'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
      error: 'Selecione o sexo.',
    }),
    companyId: z.string().min(1, 'Selecione a empresa.'),
    positionId: z.string().min(1, 'Selecione o cargo.'),
    departmentId: z.string().min(1, 'Selecione o departamento.'),
    postalCode: z.string().optional(),
    hasNoPostalCode: z.boolean().optional(),
    street: z.string().min(1, 'Informe o logradouro.'),
    streetNumber: z.string().optional(),
    hasNoStreetNumber: z.boolean().optional(),
    neighborhood: z.string().min(1, 'Informe o bairro.'),
    city: z.string().min(1, 'Informe a cidade.'),
    state: z.string().min(1, 'Selecione o estado.'),
  })
  .refine(
    (data) =>
      data.hasNoStreetNumber === true || Boolean(data.streetNumber?.trim()),
    {
      message: 'Informe o número ou marque "Sem número".',
      path: ['streetNumber'],
    },
  )
  .refine(
    (data) => data.hasNoPostalCode === true || Boolean(data.postalCode?.trim()),
    {
      message: 'Informe o CEP ou marque "CEP não encontrado".',
      path: ['postalCode'],
    },
  )

export type EmployeeInput = z.infer<typeof employeeSchema>
