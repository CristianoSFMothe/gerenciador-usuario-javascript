# AGENTS.md

Guia para agentes de IA (Claude Code, Cursor, Copilot, etc.) trabalhando neste repositório. Leia este arquivo antes de propor ou aplicar qualquer mudança.

## Contexto do projeto

Este repositório está em refatoração: de um CRUD de usuários em JavaScript puro (AdminLTE + jQuery + `localStorage`) para uma aplicação full-stack moderna. A refatoração segue fases incrementais (Fase 0 a Fase 8), rastreadas via Milestones e Issues no GitHub Project do repositório. Antes de iniciar qualquer tarefa, verifique a Issue e o Milestone correspondentes para entender o escopo exato.

A branch de trabalho é `refactor/nextjs-migration`. Não commitar diretamente na `main` — ela permanece como snapshot da versão legada (ver release `v1-legacy-vanilla-js`).

## Stack

- Next.js 15 (App Router, TypeScript, Server Components/Server Actions)
- Prisma ORM + PostgreSQL (Neon ou Supabase)
- Better Auth (autenticação email/senha)
- TailwindCSS v4 (config via `@theme`, sem `tailwind.config.js`)
- shadcn/ui (componentes)
- Zod + React Hook Form (validação)
- Vitest (testes unitários) + Playwright (testes E2E)

Não introduzir bibliotecas fora dessa stack sem justificativa explícita na PR.

## Comandos

```bash
npm run dev          # ambiente de desenvolvimento
npm run build         # build de produção
npm run lint           # ESLint
npm run format         # Prettier
npx prisma migrate dev # aplicar migrations em dev
npx prisma studio      # inspecionar o banco
npm run test            # testes unitários (Vitest)
npx playwright test     # testes E2E
```

Sempre rodar `npm run lint` e `npm run test` antes de considerar uma tarefa concluída. Se `npx playwright test` não puder ser executado no ambiente do agente, sinalizar isso explicitamente em vez de pular a etapa silenciosamente.

## Estrutura de pastas

```
src/
├── app/
│   ├── (auth)/login|register
│   ├── (dashboard)/usuarios/...
│   └── api/auth/[...all]/route.ts
├── components/
│   ├── ui/            # componentes shadcn (não editar manualmente, regenerar via CLI)
│   └── usuarios/       # componentes de domínio
├── actions/            # Server Actions (mutações)
├── lib/                # auth.ts, prisma.ts, validations/
prisma/
├── schema.prisma
└── seed.ts
```

Regras de organização:

- Nada de lógica de negócio dentro de componentes de UI — fica em `actions/` ou `lib/`.
- Um schema Zod por entidade, reaproveitado no formulário (client) e na Server Action (server). Não duplicar validação.
- Server Components por padrão; `"use client"` só quando houver interatividade real.
- Mutações internas via Server Actions, não criar Route Handlers a menos que seja uma integração externa (ex.: Better Auth já expõe as suas).

## Banco de dados

- Qualquer mudança de schema passa por `prisma/schema.prisma` seguida de `npx prisma migrate dev --name <descricao>`. Não editar o banco manualmente.
- `lib/prisma.ts` é o único ponto de instanciação do `PrismaClient` (singleton). Não instanciar `PrismaClient` em outros arquivos.
- Seeds ficam em `prisma/seed.ts`, idempotentes sempre que possível.

## Autenticação

- Configuração central em `lib/auth.ts`. Não duplicar lógica de sessão fora dali.
- Rotas do dashboard são protegidas via `middleware.ts` — ao criar uma nova rota autenticada, confirmar que ela está coberta pelo matcher do middleware.

## Estilo e commits

- TypeScript estrito; evitar `any`.
- Commits no padrão Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- Um PR por Issue sempre que possível, com o título referenciando o número da issue (`Closes #N`).
- Não commitar `.env`, chaves ou segredos. Usar `.env.example` como referência de variáveis.

## Testes

- Toda Server Action nova precisa de teste unitário (mock do Prisma) em `__tests__/` ou colocation `*.test.ts`.
- Fluxos críticos (login, CRUD completo de usuário) precisam de cobertura E2E em Playwright antes de serem considerados "done".

## O que evitar

- Não reintroduzir dependências do projeto legado (jQuery, Bootstrap, AdminLTE, bower).
- Não usar `localStorage` para persistência de dados de domínio — isso é o que está sendo eliminado nesta refatoração.
- Não pular fases: uma Issue de uma fase posterior não deve ser resolvida antes das dependências da fase anterior estarem concluídas, a menos que explicitamente indicado.
