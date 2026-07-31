---
name: enterprise-system
description: Use this agent for work on the Pessoa (funcionário), Empresa and Dashboard features of this project — the "Enterprise System" admin area added on top of the original CRUD refactor. Complements AGENTS.md; do not use it to change the (auth) login/register screens, which are covered directly by AGENTS.md and the Fase 3 issues. Trigger on tasks like "cadastro de pessoa", "cadastro de empresa", "dashboard", "tabela de usuários paginada", "busca de CEP", "cálculo de idade".
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
---

# Enterprise System agent

Complemento do `AGENTS.md` da raiz do projeto. Leia o `AGENTS.md` primeiro — todas as regras de lá (stack, comandos, ESLint/Prettier, Husky, testes, Clean Code/TDD) valem aqui também. Este arquivo cobre especificamente o domínio adicionado depois da Fase 3: gestão de Pessoas (funcionários), Empresas e o Dashboard administrativo.

Referência visual: Figma "admin" — https://www.figma.com/design/LhfaB9YPvIhkzN28X1vLzJ/admin (arquivo com 3 frames: `Dashboard com Gráficos - Kinetic Enterprise`, `Cadastro de Pessoa - Kinetic Enterprise`, `Gestão de Empresa - Kinetic Enterprise`). Não escrever código a partir deste agente sem confirmação explícita do usuário — ele existe para dar contexto de domínio consistente quando essa confirmação vier.

## Contexto: por que este domínio existe

O projeto original (`gerenciador-usuario-javascript`) é um CRUD simples de "usuários". Na refatoração, esse conceito se dividiu em dois:

- **User** (Better Auth) — quem _loga_ no sistema. Já coberto pelas Fases 2-3 do `AGENTS.md`.
- **Pessoa / Funcionário** — o registro _gerenciado dentro_ do sistema (o que aparece na tabela do dashboard, com matrícula, cargo, setor etc.). Não é a mesma entidade que `User`. Uma Pessoa pode existir sem nunca ter uma conta de login associada.

Nunca fundir as duas entidades num único model Prisma. Se uma Pessoa também precisar logar no futuro, isso é uma relação opcional (`Pessoa.userId?`), não um merge de schema.

## Modelo de dados (referência para `prisma/schema.prisma`)

Entidades e relações esperadas:

- **Empresa** — `nomeFantasia`, `razaoSocial`, `cnpj` (único), `inscricaoEstadual?`, `inscricaoMunicipal?`, `dataAbertura?`, `site?`, `email?`, `telefoneFixo?`, `telefoneCelular?`, endereço (CEP, logradouro, número, complemento, bairro, cidade, UF — mesmos campos usados em Pessoa, considerar um objeto/embed reaproveitável), timestamps.
- **Cargo** — pertence a uma `Empresa` (`empresaId`), `nome` (ex.: "Engenheira de Software"). É a lista de funções que a empresa oferece; alimenta o seletor de cargo no cadastro de Pessoa filtrado pela empresa escolhida.
- **Pessoa** — `matricula` (gerada/sequencial, única), `nome`, `sobrenome`, `telefone`, `cpf` (único, validar dígitos verificadores), `email`, `dataNascimento`, `sexo` (enum), `status` (enum: `ATIVO` | `DESATIVADO`), `empresaId` → Empresa, `cargoId` → Cargo, `setor` (string ou relação — no Figma aparece como texto livre associado ao cargo/empresa, confirmar com o usuário antes de modelar como enum), endereço (CEP, logradouro, número, complemento, bairro, cidade, UF), timestamps.
- Idade **não é persistida** — é sempre derivada de `dataNascimento` em tempo de leitura/exibição (client ou server), nunca armazenada no banco (evita dados desatualizados).

## Cálculo de idade

Calcular a partir de `dataNascimento` comparando com a data atual, considerando se o aniversário deste ano já passou:

```ts
function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date()
  let idade = hoje.getFullYear() - dataNascimento.getFullYear()
  const aniversarioEsteAno =
    hoje.getMonth() > dataNascimento.getMonth() ||
    (hoje.getMonth() === dataNascimento.getMonth() &&
      hoje.getDate() >= dataNascimento.getDate())
  if (!aniversarioEsteAno) idade -= 1
  return idade
}
```

No formulário, o campo "Idade" é somente leitura e atualiza ao vivo conforme o usuário preenche "Data de Nascimento" (ver mockup: campo com fundo cinza, "Calculado automaticamente").

## Integração de CEP

Usada em dois formulários (Pessoa e Empresa) com o mesmo comportamento: campo CEP + botão/ação de busca → preenche logradouro, bairro, cidade, UF automaticamente; se a API não encontrar ou falhar, os campos ficam editáveis manualmente (nunca travar o formulário nesse caso).

- API recomendada: ViaCEP (`https://viacep.com.br/ws/{cep}/json/`), gratuita e sem necessidade de chave.
- Implementar como Server Action ou route handler dedicado (`lib/cep.ts` + action), não fetch direto no client, para poder tratar erro/timeout de forma consistente e testável.
- Tratar CEP inválido (menos de 8 dígitos) e resposta `{ erro: true }` da ViaCEP como "não encontrado" → liberar edição manual dos campos, nunca mostrar erro bloqueante.

## Telas

### Dashboard (`(dashboard)/page.tsx` ou rota equivalente)

- 3 cards lado a lado (grid): Total de Usuários, Usuários Ativos, Usuários Desativados — cada um com ícone, número grande e uma variação/observação pequena (ex.: "+12%", "vs mês anterior", "Atenção").
- 2 gráficos lado a lado: linha (crescimento ao longo do tempo) e rosca/donut (distribuição por setor). Usar Recharts (já é o padrão razoável para Next.js/shadcn; confirmar se o projeto já tem uma lib de gráficos antes de adicionar outra).
- Tabela paginada abaixo dos gráficos, colunas exatas: **Matrícula, Nome, Sobrenome, Cargo, Setor, Status, Ações**. Paginação mostrando 25 por página ("Mostrando 1 até 25 de N resultados"), com números de página + prev/next. Ações = visualizar / editar / remover (dropdown ou grupo de ícones).
- Badge de status: `ATIVO` (verde) / `DESATIVADO` (vermelho) — usar os tokens semânticos do tema (`--color-*` já configurados em `globals.css`), não cores hardcoded.

### Cadastro de Pessoa

Campos e ordem (ver mockup): Nome, Sobrenome, Telefone, CPF, Email, Data de Nascimento, Idade (auto), depois Sexo / Empresa / Cargo (selects lado a lado — Cargo depende da Empresa selecionada, desabilitar/limpar Cargo até uma Empresa ser escolhida), depois bloco "Endereço" com CEP + Logradouro/Bairro/Cidade/Estado.

### Edição de Pessoa

Mesmo formulário do cadastro, pré-preenchido, reaproveitando o máximo de componentes/schema possível (não duplicar a lógica de validação — um único schema Zod usado em criar e editar).

### Cadastro/Gestão de Empresa

Campos: Nome Fantasia, CNPJ, Razão Social, Inscrição Estadual, Inscrição Municipal, Data de Abertura, Site, Email, Telefone Fixo, Telefone Celular, campo de tags para os Cargos/Funções que a empresa oferece (essa lista é o que popula o seletor de Cargo no cadastro de Pessoa quando essa Empresa é selecionada), e bloco de Endereço com a mesma busca por CEP.

## Linguagem visual (observada no Figma, para manter consistência)

- Layout admin: sidebar fixa à esquerda (logo + nome do sistema + nav: Dashboard, Users (Pessoas), Companies (Empresas), Settings, Logout) + topbar com busca, notificações e avatar do usuário.
- Fundo da área de conteúdo levemente acinzentado/azulado, cards em branco com borda sutil e cantos arredondados (`rounded-xl`/`rounded-2xl`), inputs com fundo levemente cinza quando "preenchido automaticamente" (readonly).
- Cor de destaque: azul (ações primárias, itens ativos do menu, botões principais). Não copiar tons exatos do Figma pixel a pixel — adaptar à paleta de tokens já definida em `globals.css` (`--primary`, `--accent` etc.) para manter consistência com o resto do app (incluindo as telas de login/registro).
