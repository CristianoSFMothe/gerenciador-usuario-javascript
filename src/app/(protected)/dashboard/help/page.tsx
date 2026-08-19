import type { LucideIcon } from 'lucide-react'
import { Building2, LifeBuoy, Lock, Rocket, Shield, Users } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion'

type HelpCategory = {
  title: string
  description: string
  icon: LucideIcon
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    title: 'Primeiros Passos',
    description:
      'Conceitos básicos para configurar sua conta e navegar pelo painel administrativo.',
    icon: Rocket,
  },
  {
    title: 'Funcionários',
    description: 'Como cadastrar, editar, ativar e desativar funcionários.',
    icon: Users,
  },
  {
    title: 'Empresas',
    description:
      'Cadastro de empresas, departamentos e preenchimento automático de endereço por CEP.',
    icon: Building2,
  },
  {
    title: 'Papéis e Permissões',
    description:
      'Diferenças entre papéis e como conceder permissões granulares de acesso.',
    icon: Shield,
  },
  {
    title: 'Segurança da Conta',
    description:
      'Autenticação, sessões ativas e boas práticas para proteger sua conta.',
    icon: Lock,
  },
  {
    title: 'Solução de Problemas',
    description:
      'Respostas para erros comuns de login, formulários e permissões.',
    icon: LifeBuoy,
  },
]

type HelpFaqItem = {
  question: string
  answer: string
}

const HELP_FAQ_ITEMS: HelpFaqItem[] = [
  {
    question: 'Como faço para redefinir a senha de um funcionário?',
    answer:
      'No momento o sistema não possui um fluxo de autoatendimento para redefinição de senha. Entre em contato com um administrador para revisar o acesso do usuário.',
  },
  {
    question: 'Posso exportar a listagem de funcionários e empresas?',
    answer:
      'Sim. Nas telas de Funcionários e Empresas, use o botão de exportação para gerar um relatório em PDF com os dados da listagem atual.',
  },
  {
    question: 'Qual a diferença entre os papéis de acesso?',
    answer:
      'Cada papel agrupa um conjunto de permissões granulares, configuráveis na tela Papéis e Permissões — lá você define exatamente quais ações cada papel pode executar em cada módulo.',
  },
  {
    question: 'Como funciona o cálculo de idade no cadastro de funcionário?',
    answer:
      'A idade é calculada automaticamente a partir da Data de Nascimento informada. Ela não é armazenada no banco de dados — é sempre recalculada no momento da exibição, evitando dados desatualizados.',
  },
]

const HelpPage = () => {
  return (
    <div className='flex flex-col gap-10 p-4 sm:p-8'>
      <div className='mx-auto flex max-w-2xl flex-col items-center gap-3 text-center'>
        <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[36px] sm:leading-[44px] dark:text-[#f1f5f9]'>
          Como podemos ajudar você?
        </h1>
        <p className='text-sm text-[#434654] sm:text-base dark:text-[#94a3b8]'>
          Pesquise na central de ajuda ou explore as categorias abaixo para
          encontrar respostas sobre o Enterprise System.
        </p>
      </div>

      <div className='mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {HELP_CATEGORIES.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className='flex flex-col gap-2 rounded-lg border border-[#dfe1e6] bg-white p-6 dark:border-[#1e293b] dark:bg-[#0f172a]'
          >
            <div className='flex size-12 items-center justify-center rounded-lg bg-[#003d9b]/10 dark:bg-[#60a5fa]/10'>
              <Icon className='size-5 text-[#003d9b] dark:text-[#60a5fa]' />
            </div>
            <h2 className='pt-2 text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
              {title}
            </h2>
            <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
        <h2 className='text-center text-xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px] dark:text-[#f1f5f9]'>
          Perguntas Frequentes
        </h2>

        <Accordion
          type='single'
          collapsible
          className='rounded-lg border border-[#dfe1e6] bg-white px-4 dark:border-[#1e293b] dark:bg-[#0f172a]'
        >
          {HELP_FAQ_ITEMS.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`item-${index}`}
              className='border-[#dfe1e6] dark:border-[#1e293b]'
            >
              <AccordionTrigger className='text-[#121d22] hover:no-underline dark:text-[#f1f5f9]'>
                {question}
              </AccordionTrigger>
              <AccordionContent className='text-[#434654] dark:text-[#94a3b8]'>
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className='mx-auto flex w-full max-w-3xl flex-col items-center gap-2 rounded-lg border border-[#b2c5ff] bg-[#003d9b]/5 p-6 text-center dark:border-[#60a5fa]/30 dark:bg-[#60a5fa]/5'>
        <h2 className='text-lg font-semibold text-[#003d9b] dark:text-[#60a5fa]'>
          Ainda precisa de ajuda?
        </h2>
        <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          Fale com um administrador do sistema para tratar dúvidas que não foram
          respondidas aqui.
        </p>
      </div>
    </div>
  )
}

export default HelpPage
