import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string().min(1, 'Informe o nome.'),
  lastName: z.string().min(1, 'Informe o sobrenome.'),
  phone: z.string().min(1, 'Informe o telefone.'),
  cpf: z.string().min(1, 'Informe o CPF.'),
  email: z.email('Informe um e-mail válido.').min(1, 'Informe o e-mail.'),
  birthDate: z.string().min(1, 'Informe a data de nascimento.'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    error: 'Selecione o sexo.',
  }),
  companyId: z.string().optional(),
  positionId: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

export type EmployeeInput = z.infer<typeof employeeSchema>
