import { randomUUID } from 'node:crypto'

import { prisma } from '../src/app/_lib/prisma'
import type { Gender } from '../src/generated/prisma/client'

const DEPARTMENT_TYPES = [
  'Recursos Humanos',
  'Financeiro',
  'Contabilidade',
  'Comercial',
  'Vendas',
  'Marketing',
  'Tecnologia da Informação',
  'Jurídico',
  'Operações',
  'Logística',
  'Compras',
  'Produção',
  'Qualidade',
  'Atendimento ao Cliente',
  'Suporte Técnico',
  'Administrativo',
  'Diretoria',
  'Engenharia',
  'Pesquisa e Desenvolvimento',
  'Manutenção',
  'Almoxarifado',
  'Segurança do Trabalho',
  'Facilities',
  'Auditoria Interna',
  'Controladoria',
  'Planejamento Estratégico',
  'Relações Institucionais',
  'Comunicação',
  'Treinamento e Desenvolvimento',
  'Recepção',
]

// ---------------------------------------------------------------------------
// Brazilian document generators (CPF/CNPJ) — deterministic, valid check digits
// ---------------------------------------------------------------------------

const modulo11CheckDigit = (digits: number[], weights: number[]): number => {
  const sum = digits.reduce(
    (total, digit, index) => total + digit * weights[index],
    0,
  )
  const remainder = sum % 11

  return remainder < 2 ? 0 : 11 - remainder
}

const cpfWeights = (length: number) =>
  Array.from({ length }, (_, index) => length + 1 - index)

const generateCpf = (sequence: number): string => {
  const base = String(100_000_000 + sequence)
    .padStart(9, '0')
    .split('')
    .map(Number)
  const digit1 = modulo11CheckDigit(base, cpfWeights(base.length))
  const digit2 = modulo11CheckDigit(
    [...base, digit1],
    cpfWeights(base.length + 1),
  )

  return [...base, digit1, digit2].join('')
}

const cnpjWeights = (length: number) => {
  const weights: number[] = []
  let weight = 2

  for (let i = 0; i < length; i++) {
    weights.unshift(weight)
    weight = weight === 9 ? 2 : weight + 1
  }

  return weights
}

const generateCnpj = (sequence: number): string => {
  const root = String(10_000_000 + sequence)
    .slice(-8)
    .split('')
    .map(Number)
  const base = [...root, 0, 0, 0, 1]
  const digit1 = modulo11CheckDigit(base, cnpjWeights(base.length))
  const digit2 = modulo11CheckDigit(
    [...base, digit1],
    cnpjWeights(base.length + 1),
  )

  return [...base, digit1, digit2].join('')
}

// ---------------------------------------------------------------------------
// Reference data pools
// ---------------------------------------------------------------------------

const CITIES = [
  { city: 'São Paulo', state: 'SP', ddd: '11' },
  { city: 'Rio de Janeiro', state: 'RJ', ddd: '21' },
  { city: 'Belo Horizonte', state: 'MG', ddd: '31' },
  { city: 'Curitiba', state: 'PR', ddd: '41' },
  { city: 'Porto Alegre', state: 'RS', ddd: '51' },
  { city: 'Salvador', state: 'BA', ddd: '71' },
  { city: 'Recife', state: 'PE', ddd: '81' },
  { city: 'Fortaleza', state: 'CE', ddd: '85' },
  { city: 'Brasília', state: 'DF', ddd: '61' },
  { city: 'Campinas', state: 'SP', ddd: '19' },
  { city: 'Florianópolis', state: 'SC', ddd: '48' },
  { city: 'Goiânia', state: 'GO', ddd: '62' },
  { city: 'Manaus', state: 'AM', ddd: '92' },
  { city: 'Belém', state: 'PA', ddd: '91' },
  { city: 'Vitória', state: 'ES', ddd: '27' },
  { city: 'Natal', state: 'RN', ddd: '84' },
  { city: 'Joinville', state: 'SC', ddd: '47' },
  { city: 'Londrina', state: 'PR', ddd: '43' },
  { city: 'Uberlândia', state: 'MG', ddd: '34' },
  { city: 'Ribeirão Preto', state: 'SP', ddd: '16' },
]

const STREETS = [
  'Rua das Acácias',
  'Avenida Paulista',
  'Rua dos Andradas',
  'Avenida Brasil',
  'Rua Sete de Setembro',
  'Avenida das Nações',
  'Rua XV de Novembro',
  'Alameda Santos',
  'Rua Voluntários da Pátria',
  'Avenida Getúlio Vargas',
  'Rua Marechal Deodoro',
  'Rua da Consolação',
  'Avenida Ipiranga',
  'Rua Barão do Rio Branco',
  'Avenida Contorno',
  'Rua Coronel Genuíno',
  'Rua Duque de Caxias',
  'Avenida Rio Branco',
  'Rua Bento Gonçalves',
  'Avenida Afonso Pena',
]

const NEIGHBORHOODS = [
  'Centro',
  'Jardim América',
  'Boa Vista',
  'Cidade Nova',
  'Santa Mônica',
  'Vila Nova',
  'Bela Vista',
  'Jardim Europa',
  'Alto da Boa Vista',
  'Parque das Nações',
  'São José',
  'Petrópolis',
  'Jardim Botânico',
  'Vila Industrial',
  'Setor Oeste',
]

const MALE_FIRST_NAMES = [
  'João',
  'Pedro',
  'Lucas',
  'Gabriel',
  'Matheus',
  'Rafael',
  'Bruno',
  'Felipe',
  'Gustavo',
  'Rodrigo',
  'Thiago',
  'André',
  'Marcelo',
  'Diego',
  'Vinícius',
  'Leonardo',
  'Eduardo',
  'Fernando',
  'Ricardo',
  'Daniel',
]

const FEMALE_FIRST_NAMES = [
  'Ana',
  'Maria',
  'Beatriz',
  'Carla',
  'Fernanda',
  'Juliana',
  'Camila',
  'Larissa',
  'Patrícia',
  'Amanda',
  'Bruna',
  'Renata',
  'Vanessa',
  'Aline',
  'Priscila',
  'Débora',
  'Letícia',
  'Tatiane',
  'Mariana',
  'Gabriela',
]

const LAST_NAMES = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Rodrigues',
  'Ferreira',
  'Alves',
  'Pereira',
  'Lima',
  'Gomes',
  'Costa',
  'Ribeiro',
  'Martins',
  'Carvalho',
  'Almeida',
  'Lopes',
  'Soares',
  'Fernandes',
  'Vieira',
  'Barbosa',
  'Rocha',
  'Dias',
  'Monteiro',
  'Cardoso',
  'Reis',
  'Araújo',
  'Castro',
  'Andrade',
  'Nascimento',
  'Correia',
]

const POSITIONS_BY_DEPARTMENT: Record<string, string[]> = {
  'Tecnologia da Informação': [
    'Desenvolvedor de Software',
    'Engenheiro de Software',
    'Analista de Sistemas',
    'DevOps Engineer',
    'Analista de Suporte de TI',
  ],
  'Recursos Humanos': [
    'Analista de RH',
    'Assistente de RH',
    'Recrutador',
    'Gerente de RH',
  ],
  Financeiro: [
    'Analista Financeiro',
    'Assistente Financeiro',
    'Controller',
    'Analista de Contas a Pagar',
  ],
  Comercial: [
    'Executivo Comercial',
    'Consultor Comercial',
    'Coordenador Comercial',
  ],
  Vendas: ['Vendedor', 'Representante de Vendas', 'Supervisor de Vendas'],
  Marketing: [
    'Analista de Marketing',
    'Social Media',
    'Coordenador de Marketing',
  ],
  Operações: [
    'Analista de Operações',
    'Coordenador de Operações',
    'Assistente Operacional',
  ],
  Administrativo: [
    'Assistente Administrativo',
    'Analista Administrativo',
    'Auxiliar de Escritório',
  ],
  'Atendimento ao Cliente': [
    'Atendente',
    'Analista de Suporte ao Cliente',
    'Supervisor de Atendimento',
  ],
  Produção: [
    'Operador de Produção',
    'Supervisor de Produção',
    'Técnico de Produção',
  ],
  Logística: [
    'Analista de Logística',
    'Auxiliar de Logística',
    'Coordenador de Logística',
  ],
  Jurídico: ['Advogado', 'Analista Jurídico', 'Assistente Jurídico'],
}

const DEPARTMENT_ROTATION = Object.keys(POSITIONS_BY_DEPARTMENT)

type CompanySeed = {
  tradeName: string
  legalName: string
  sectors: string[]
}

const COMPANIES: CompanySeed[] = [
  {
    tradeName: 'TechNova Sistemas',
    legalName: 'TechNova Sistemas de Informação Ltda.',
    sectors: ['Tecnologia', 'Software'],
  },
  {
    tradeName: 'Vida Plena Saúde',
    legalName: 'Vida Plena Serviços de Saúde S.A.',
    sectors: ['Saúde', 'Bem-estar'],
  },
  {
    tradeName: 'Mercado Bom Preço',
    legalName: 'Bom Preço Comércio Varejista Ltda.',
    sectors: ['Varejo', 'Alimentos'],
  },
  {
    tradeName: 'Sabor Caseiro Alimentos',
    legalName: 'Sabor Caseiro Indústria Alimentícia Ltda.',
    sectors: ['Alimentício', 'Indústria'],
  },
  {
    tradeName: 'Saber Educacional',
    legalName: 'Saber Educacional Serviços Educacionais S.A.',
    sectors: ['Educação'],
  },
  {
    tradeName: 'RotaCargo Logística',
    legalName: 'RotaCargo Transportes e Logística Ltda.',
    sectors: ['Logística', 'Transporte'],
  },
  {
    tradeName: 'Capital Sólido Investimentos',
    legalName: 'Capital Sólido Gestão de Investimentos S.A.',
    sectors: ['Financeiro'],
  },
  {
    tradeName: 'Construtora Horizonte',
    legalName: 'Horizonte Construções e Incorporações Ltda.',
    sectors: ['Construção Civil'],
  },
  {
    tradeName: 'AgroVale Alimentos',
    legalName: 'AgroVale Agronegócio Ltda.',
    sectors: ['Agronegócio'],
  },
  {
    tradeName: 'Energia Clara',
    legalName: 'Energia Clara Geração e Distribuição S.A.',
    sectors: ['Energia'],
  },
  {
    tradeName: 'Destino Certo Turismo',
    legalName: 'Destino Certo Viagens e Turismo Ltda.',
    sectors: ['Turismo'],
  },
  {
    tradeName: 'AutoMax Peças',
    legalName: 'AutoMax Comércio de Autopeças Ltda.',
    sectors: ['Automotivo'],
  },
  {
    tradeName: 'Fio & Estilo Moda',
    legalName: 'Fio & Estilo Confecções Ltda.',
    sectors: ['Moda', 'Vestuário'],
  },
  {
    tradeName: 'FarmaVida',
    legalName: 'FarmaVida Distribuidora Farmacêutica S.A.',
    sectors: ['Farmacêutico'],
  },
  {
    tradeName: 'ConectaTel Telecom',
    legalName: 'ConectaTel Telecomunicações Ltda.',
    sectors: ['Telecomunicações'],
  },
  {
    tradeName: 'Voz Ativa Mídia',
    legalName: 'Voz Ativa Comunicação e Mídia Ltda.',
    sectors: ['Comunicação', 'Mídia'],
  },
  {
    tradeName: 'Prisma Consultoria',
    legalName: 'Prisma Consultoria Empresarial Ltda.',
    sectors: ['Consultoria'],
  },
  {
    tradeName: 'Lar Ideal Imóveis',
    legalName: 'Lar Ideal Empreendimentos Imobiliários Ltda.',
    sectors: ['Imobiliário'],
  },
  {
    tradeName: 'MetalForte Indústria',
    legalName: 'MetalForte Indústria Metalúrgica S.A.',
    sectors: ['Metalurgia', 'Indústria'],
  },
  {
    tradeName: 'Bela Pele Cosméticos',
    legalName: 'Bela Pele Indústria de Cosméticos Ltda.',
    sectors: ['Cosméticos'],
  },
]

const EMPLOYEES_PER_COMPANY = 30
const DEPARTMENTS_PER_COMPANY = 5
const REGISTRATION_NUMBER_PREFIX = 'FN'

const HIRE_MONTHS_RANGE = 6
const EMPLOYEES_PER_HIRE_MONTH = EMPLOYEES_PER_COMPANY / HIRE_MONTHS_RANGE

const buildEmployeeCreatedAt = (indexInCompany: number, sequence: number) => {
  const now = new Date()
  const monthsAgo =
    HIRE_MONTHS_RANGE -
    1 -
    Math.floor(indexInCompany / EMPLOYEES_PER_HIRE_MONTH)

  return new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo,
    1 + (sequence % 27),
  )
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

const pick = <T>(items: T[], index: number) => items[index % items.length]

// ---------------------------------------------------------------------------
// Seed steps
// ---------------------------------------------------------------------------

const seedDepartmentTypes = async () => {
  await Promise.all(
    DEPARTMENT_TYPES.map((name) =>
      prisma.departmentType.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  )

  console.log(`Seeded ${DEPARTMENT_TYPES.length} department types.`)
}

const seedCompanies = async () => {
  const companies = []

  for (const [index, company] of COMPANIES.entries()) {
    const location = pick(CITIES, index)
    const slug = slugify(company.tradeName)

    const record = await prisma.company.upsert({
      where: { cnpj: generateCnpj(index) },
      update: {},
      create: {
        tradeName: company.tradeName,
        legalName: company.legalName,
        cnpj: generateCnpj(index),
        stateRegistration: String(100_000_000 + index),
        municipalRegistration: String(5_000_000 + index),
        foundedAt: new Date(1995 + (index % 25), index % 12, 10),
        website: `https://www.${slug}.com.br`,
        email: `contato@${slug}.com.br`,
        landlinePhone: `${location.ddd}${String(30_000_000 + index).padStart(8, '0')}`,
        mobilePhone: `${location.ddd}9${String(8_000_0000 + index).padStart(7, '0')}`,
        sectors: company.sectors,
        postalCode: String(1_000_000 + index * 111).padStart(8, '0'),
        street: pick(STREETS, index),
        streetNumber: String(100 + index * 7),
        neighborhood: pick(NEIGHBORHOODS, index),
        city: location.city,
        state: location.state,
      },
    })

    companies.push({ ...record, location })
  }

  console.log(`Seeded ${companies.length} companies.`)

  return companies
}

const seedEmployeesForCompany = async (
  company: Awaited<ReturnType<typeof seedCompanies>>[number],
  companyIndex: number,
) => {
  const departmentTypeNames = Array.from(
    { length: DEPARTMENTS_PER_COMPANY },
    (_, i) => pick(DEPARTMENT_ROTATION, companyIndex + i),
  )

  const departmentTypes = await prisma.departmentType.findMany({
    where: { name: { in: departmentTypeNames } },
  })
  const departmentTypeIdByName = new Map(
    departmentTypes.map((departmentType) => [
      departmentType.name,
      departmentType.id,
    ]),
  )

  const departments: { id: string; typeName: string }[] = []

  for (const typeName of departmentTypeNames) {
    const departmentTypeId = departmentTypeIdByName.get(typeName)

    if (!departmentTypeId) continue

    const department = await prisma.department.upsert({
      where: {
        companyId_departmentTypeId: { companyId: company.id, departmentTypeId },
      },
      update: {},
      create: { companyId: company.id, departmentTypeId },
    })

    departments.push({ id: department.id, typeName })
  }

  let createdCount = 0

  for (let i = 0; i < EMPLOYEES_PER_COMPANY; i++) {
    const sequence = companyIndex * EMPLOYEES_PER_COMPANY + i
    const cpf = generateCpf(sequence)

    const existingEmployee = await prisma.employee.findUnique({
      where: { cpf },
      select: { id: true },
    })

    if (existingEmployee) {
      await prisma.employee.update({
        where: { id: existingEmployee.id },
        data: { createdAt: buildEmployeeCreatedAt(i, sequence) },
      })
      continue
    }

    const isFemale = sequence % 2 === 0
    const firstName = isFemale
      ? pick(FEMALE_FIRST_NAMES, sequence)
      : pick(MALE_FIRST_NAMES, sequence)
    const lastName = pick(LAST_NAMES, sequence + companyIndex)
    const department = departments[i % departments.length]
    const positions = POSITIONS_BY_DEPARTMENT[department.typeName]
    const position = pick(positions, sequence)
    const gender: Gender = isFemale ? 'FEMALE' : 'MALE'
    const status = sequence % 6 === 5 ? 'INACTIVE' : 'ACTIVE'

    await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          firstName,
          lastName,
          phone: `${company.location.ddd}9${String(80_000_000 + sequence).padStart(8, '0')}`,
          cpf,
          email: `${slugify(firstName)}.${slugify(lastName)}${sequence}@${slugify(company.tradeName)}.com.br`,
          birthDate: new Date(
            1975 + (sequence % 28),
            sequence % 12,
            1 + (sequence % 27),
          ),
          gender,
          status,
          companyId: company.id,
          position,
          departmentId: department.id,
          postalCode: String(2_000_000 + sequence * 37).padStart(8, '0'),
          street: pick(STREETS, sequence),
          streetNumber: String(10 + (sequence % 500)),
          neighborhood: pick(NEIGHBORHOODS, sequence),
          city: company.location.city,
          state: company.location.state,
          registrationNumber: randomUUID(),
          createdAt: buildEmployeeCreatedAt(i, sequence),
        },
      })

      await tx.employee.update({
        where: { id: employee.id },
        data: {
          registrationNumber: `${REGISTRATION_NUMBER_PREFIX}${String(
            employee.sequentialNumber,
          ).padStart(6, '0')}`,
        },
      })
    })

    createdCount += 1
  }

  return createdCount
}

const seedEmployees = async (
  companies: Awaited<ReturnType<typeof seedCompanies>>,
) => {
  let totalCreated = 0

  for (const [index, company] of companies.entries()) {
    totalCreated += await seedEmployeesForCompany(company, index)
  }

  console.log(`Seeded ${totalCreated} employees.`)
}

const main = async () => {
  await seedDepartmentTypes()
  const companies = await seedCompanies()
  await seedEmployees(companies)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
