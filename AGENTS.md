# AGENTS.md

Guia de referência para agentes de IA (Claude Code, Cursor, Copilot, etc.) e desenvolvedores humanos trabalhando neste repositório. Leia este arquivo por completo antes de propor, gerar ou aplicar qualquer mudança de código.

---

## 1. Contexto

Este repositório está em processo de refatoração: um CRUD de usuários originalmente escrito em JavaScript puro (ES6), com template visual AdminLTE, jQuery/Bootstrap via Bower e persistência em `localStorage`, está sendo reconstruído como uma aplicação full-stack moderna.

Objetivo da refatoração: manter o mesmo domínio de negócio (gerenciamento de usuários — criar, listar, editar, excluir) mas sobre uma arquitetura atual, com banco de dados real, autenticação de verdade, testes automatizados e um design system consistente.

Pontos de referência do projeto:

- A versão original está preservada na release `v1-legacy-vanilla-js` e na branch `main`.
- Todo o trabalho de refatoração acontece na branch `refactor/nextjs-migration`. Não commitar diretamente na `main`.
- O plano de refatoração está dividido em 9 fases (Fase 0 a Fase 8), rastreadas via Milestones e Issues no GitHub Project do repositório. Antes de iniciar qualquer tarefa, o agente deve identificar a Issue/Milestone correspondente e trabalhar dentro do escopo dela — não adiantar tarefas de fases futuras sem necessidade explícita.
- Cada Issue deve ser resolvida em um PR próprio, pequeno e revisável, referenciando a Issue (`Closes #N`).

Ordem de dependência entre fases (não pular etapas):
`Fase 0 (Fundação)` → `Fase 1 (Design System)` → `Fase 2 (Banco de Dados)` → `Fase 3 (Autenticação)` → `Fase 4 (CRUD)` → `Fase 5 (UX/UI)` → `Fase 6 (Testes)` → `Fase 7 (Deploy)` → `Fase 8 (Extras)`.

---

## 2. Stacks (Tecnologias)

| Camada       | Tecnologia                                              | Observações                                                                                                                            |
| ------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | **Next.js** (App Router)                                | Server Components por padrão, Server Actions para mutações, TypeScript estrito                                                         |
| Estilo       | **TailwindCSS**                                         | Configuração via `@theme` (CSS-first), sem `tailwind.config.js` tradicional                                                            |
| Componentes  | **shadcn/ui**                                           | Componentes copiados para `src/app/_components/ui`, não é uma dependência de node_modules — customizações vão direto no arquivo gerado |
| ORM / Banco  | **Prisma** + **PostgreSQL**                             | Banco gerenciado (Neon ou Supabase); todo acesso a dados passa pelo Prisma Client                                                      |
| Autenticação | **Better Auth**                                         | Estratégia email/senha; adapter oficial do Prisma                                                                                      |
| Validação    | **Zod** + React Hook Form                               | Um schema por entidade, reaproveitado no client e no server                                                                            |
| Qualidade    | **ESLint** + **Prettier** + **Husky** + **lint-staged** | Ver seções 7 e 8                                                                                                                       |
| Testes       | **Vitest** (unitário) + **Playwright** (E2E)            | TDD sempre que praticável — ver seção 10                                                                                               |

Não introduzir bibliotecas fora dessa stack sem justificativa explícita na PR (ex.: não adicionar Redux, Axios, styled-components, Material UI, etc. sem necessidade real).

---

## 3. Comandos

```bash
# Desenvolvimento
npm run dev                  # inicia o servidor de desenvolvimento (Next.js)
npm run build                 # build de produção
npm run start                 # roda o build de produção localmente

# Qualidade de código
npm run lint                   # ESLint
npm run lint:fix                # ESLint com correção automática
npm run format                  # Prettier (escreve)
npm run format:check             # Prettier (somente verifica)
npm run typecheck                 # tsc --noEmit

# Banco de dados (Prisma)
npx prisma init                    # inicializa o Prisma no projeto (uma vez)
npx prisma migrate dev --name X     # cria e aplica uma migration em dev
npx prisma migrate deploy            # aplica migrations em produção
npx prisma generate                   # gera o client a partir do schema
npx prisma studio                      # UI para inspecionar o banco
npx prisma db seed                      # roda o script de seed

# Testes
npm run test                    # testes unitários (Vitest) em modo watch
npm run test:run                 # testes unitários, execução única (CI)
npm run test:coverage             # cobertura de testes
npx playwright test                # testes E2E
npx playwright test --ui            # testes E2E com interface

# Git hooks
npx husky init                   # configura o Husky (uma vez, na Fase 0)
```

Antes de considerar qualquer tarefa concluída, o agente deve rodar, nesta ordem: `npm run typecheck`, `npm run lint`, `npm run test:run`. Se algum comando não puder ser executado no ambiente do agente, isso deve ser sinalizado explicitamente — nunca assumir que passou.

---

## 4. Estrutura de pastas

```
prisma/
├── schema.prisma
├── seed.ts
└── migrations/

src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # sidebar + topbar
│   │   └── usuarios/
│   │       ├── page.tsx             # listagem
│   │       ├── novo/page.tsx        # criação
│   │       └── [id]/page.tsx        # edição
│   ├── api/auth/[...all]/route.ts   # handler do Better Auth
│   ├── _components/
│   │   ├── ui/                      # componentes shadcn (gerados via CLI)
│   │   └── usuarios/                 # componentes de domínio (tabela, formulário, dialogs)
│   ├── _lib/
│   │   ├── auth.ts                     # config do Better Auth
│   │   ├── prisma.ts                    # client singleton
│   │   ├── utils.ts                      # helper `cn()` (shadcn)
│   │   └── validations/
│   │       └── usuario.ts                # schemas Zod
│   ├── _hooks/                              # hooks de UI compartilhados
│   ├── layout.tsx
│   ├── loading.tsx
│   └── error.tsx
├── _actions/
│   └── usuarios.ts                    # Server Actions (create/update/delete)
├── middleware.ts                          # proteção de rotas
└── __tests__/                              # testes unitários (espelha a estrutura de src/)

e2e/                                          # testes Playwright
```

Pastas prefixadas com `_` dentro de `app/` são pastas privadas do App Router (Next.js as ignora como segmento de rota) — usadas para colocation de componentes, lib e hooks junto das rotas. `_actions/` fica fora de `app/`, no nível de `src/`, por não ter relação com o roteamento.

Regras de organização:

- Nada de lógica de negócio dentro de componentes de UI — fica em `_actions/` ou `app/_lib/`.
- Um schema Zod por entidade, reaproveitado no formulário (client) e na Server Action (server). Não duplicar validação.
- Server Components por padrão; `"use client"` só quando houver interatividade real (formulários, dropdowns, dialogs).
- Mutações internas via Server Actions; Route Handlers só para integrações externas (o Better Auth já expõe o dele em `api/auth/[...all]`).
- Componentes de `app/_components/ui` são gerados pelo CLI do shadcn — evitar edições manuais grandes; se precisar customizar, prefira compor por cima em vez de reescrever o gerado.

---

## 5. Banco de dados

- Toda mudança de schema passa por `prisma/schema.prisma`, seguida de `npx prisma migrate dev --name <descricao-curta>`. Nunca editar o banco manualmente ou gerar SQL solto fora do fluxo de migrations do Prisma.
- `src/app/_lib/prisma.ts` é o único ponto de instanciação do `PrismaClient` (padrão singleton, evitando esgotar conexões em desenvolvimento):

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- Não instanciar `PrismaClient` em nenhum outro arquivo.
- `prisma/seed.ts` deve ser idempotente sempre que possível (usar `upsert` em vez de `create` puro).
- Nomes de modelos em PascalCase singular (`User`), nomes de campos em camelCase; o Prisma cuida do mapeamento para snake_case no banco via `@map`/`@@map` quando necessário.
- Toda entidade sensível (ex.: senha) nunca deve ser retornada diretamente em uma Server Action ou Server Component — usar `select` explícito no Prisma para excluir campos sensíveis.

---

## 6. Autenticação

- Configuração central do Better Auth em `src/app/_lib/auth.ts`, usando o adapter oficial do Prisma. Não duplicar lógica de sessão em outros arquivos.
- Estratégia inicial: email e senha. Provedores OAuth (Google, GitHub) são extensão futura (Fase 8), não implementar antes de solicitado.
- O Route Handler `src/app/api/auth/[...all]/route.ts` apenas delega para a instância configurada em `_lib/auth.ts` — não colocar lógica de negócio nele.
- Rotas do dashboard são protegidas via `src/middleware.ts`. Ao criar uma nova rota autenticada, confirmar que o `matcher` do middleware cobre o novo caminho.
- Senhas nunca são manipuladas manualmente — toda a lógica de hashing/verificação fica a cargo do Better Auth.
- Variáveis sensíveis (`BETTER_AUTH_SECRET`, `DATABASE_URL`, etc.) vivem apenas em `.env`, nunca commitadas; `.env.example` documenta as chaves necessárias sem valores reais.

---

## 7. Organização com ESLint e Prettier

- ESLint como fonte da verdade para regras de código; Prettier cuida exclusivamente de formatação. Não usar plugins de formatação duplicados no ESLint (evitar conflito entre os dois).

`.eslintrc.json` (base):

```json
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- `prettier-plugin-tailwindcss` mantém as classes do Tailwind ordenadas automaticamente — não reordenar classes manualmente.
- Rodar `npm run lint:fix` e `npm run format` antes de abrir PR; o hook do Husky (seção 8) já garante isso, mas o agente deve rodar manualmente também durante o desenvolvimento.
- Não desabilitar regras do ESLint com `// eslint-disable` sem justificar em comentário curto ao lado.

---

## 8. Estilo dos commits com Husky

- Commits seguem **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `style:`, `perf:`, `ci:`.
- Husky + lint-staged bloqueiam commits que não passem no lint/format; commitlint bloqueia mensagens fora do padrão.

Setup de referência (Fase 0):

```bash
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

`.husky/pre-commit`:

```bash
npx lint-staged
```

`.husky/commit-msg`:

```bash
npx --no -- commitlint --edit "$1"
```

`commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

`package.json` (trecho):

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

Convenções de branch e PR:

- Branch de trabalho: `refactor/nextjs-migration` (já criada). Sub-branches de feature, se necessárias, seguem `feat/<descricao-curta>` ou `fix/<descricao-curta>` a partir dela.
- Um PR por Issue sempre que possível, título referenciando a Issue (`Closes #N`).
- Mensagens de commit pequenas e no imperativo (`feat: adiciona listagem de usuários`, não `adicionando` ou `adicionei`).

---

## 9. Testes

- Framework unitário: **Vitest**. Framework E2E: **Playwright**.
- Cobertura mínima esperada: toda Server Action nova tem teste unitário (mock do Prisma); todo schema Zod novo tem teste unitário; fluxos críticos (login, CRUD completo de usuário) têm teste E2E.
- Testes unitários ficam em `src/__tests__/`, espelhando a estrutura de `src/`, ou colocalizados como `*.test.ts` ao lado do arquivo testado — manter consistência com o que já existir no repositório.
- Testes E2E ficam em `e2e/`, um arquivo por fluxo (`login.spec.ts`, `usuarios-crud.spec.ts`).
- Mocks de banco de dados usam o client do Prisma mockado (ex.: `vitest-mock-extended`), nunca apontam para o banco real em testes unitários.
- CI (GitHub Actions, Fase 6) roda `typecheck`, `lint`, `test:run` e `playwright test` em todo PR — nenhum PR é mergeado com esses checks vermelhos.

---

## 10. Boas práticas de código (Clean Code / TDD)

- **TDD sempre que praticável**: para Server Actions, schemas Zod e funções utilitárias, escrever o teste antes (ou junto) da implementação — red, green, refactor. Para UI puramente visual, teste manual/E2E é aceitável no lugar de TDD estrito.
- **Funções pequenas e com um único propósito.** Se uma Server Action está fazendo validação, acesso a dados e formatação de resposta em um bloco só, extrair funções auxiliares em `lib/`.
- **Nomes descritivos e consistentes** (`createUsuario`, não `create` ou `handleCreate`); evitar abreviações não óbvias.
- **Sem lógica duplicada**: se uma validação, formatação ou regra de negócio se repete em dois lugares, extrair para `lib/` ou `validations/`.
- **Tratamento de erro explícito**: Server Actions retornam um formato consistente de sucesso/erro (ex.: `{ success: boolean; error?: string }`), nunca deixam uma exception estourar sem tratamento até a UI.
- **Comentários explicam o "porquê", não o "o quê"** — código deve ser autoexplicativo o suficiente para dispensar comentários sobre o que ele faz.
- **TypeScript estrito**: evitar `any`; preferir tipos inferidos do Prisma (`Prisma.UserGetPayload<...>`) e dos schemas Zod (`z.infer<typeof schema>`) em vez de redefinir tipos manualmente.
- **Revisão antes de finalizar uma tarefa**: rodar typecheck, lint e testes (seção 3), conferir que a Issue correspondente foi totalmente atendida antes de considerar o trabalho pronto.

---

## O que evitar

- Reintroduzir dependências do projeto legado (jQuery, Bootstrap, AdminLTE, Bower).
- Usar `localStorage` para persistência de dados de domínio — é exatamente isso que está sendo eliminado nesta refatoração.
- Pular fases: uma Issue de uma fase posterior não deve ser resolvida antes das dependências da fase anterior estarem concluídas, salvo indicação explícita.
- Commitar `.env`, segredos ou chaves de API.
