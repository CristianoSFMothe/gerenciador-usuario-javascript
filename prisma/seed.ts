import { prisma } from '../src/app/_lib/prisma'

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

const main = async () => {
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

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
