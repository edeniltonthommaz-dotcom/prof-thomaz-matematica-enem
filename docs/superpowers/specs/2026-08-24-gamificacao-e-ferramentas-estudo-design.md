# Gamificação e ferramentas de estudo — porte da plataforma de concursos

Data: 2026-08-24

## Contexto

A plataforma irmã `prof-thomaz-matematica-concursos` (pasta `THOMAZ CONCURSO`)
tem várias funcionalidades de engajamento e estudo que a plataforma ENEM ainda
não tem: gamificação (XP, patentes, conquistas), simulados, revisão de erros,
favoritos, flashcards, meta diária e heatmap de atividade. O código de
referência dessas funcionalidades já existe, testado e em produção na
plataforma de concursos — este documento descreve como portá-lo, adaptado à
estrutura mais simples do ENEM.

Diferença estrutural chave: a plataforma de concursos tem uma dimensão
`nivel` (`fundamental` | `medio`) que atravessa categorias, rotas (`/[nivel]/...`),
flashcards e progresso. A plataforma ENEM **não tem** essa dimensão — é uma
lista única de 20 categorias. Por decisão explícita do usuário, a "trilha por
nível" fica de fora do porte; tudo que depende de `nivel` é removido ou
simplificado na adaptação.

## Escopo

Portar, adaptados para a estrutura flat do ENEM:

1. Gamificação (XP, patentes, conquistas, sequência de dias, heatmap, meta diária)
2. Simulados
3. Revisão (questões erradas)
4. Favoritos
5. Flashcards

Fora de escopo: qualquer coisa que dependa de nível (seletor fundamental/médio,
gráfico comparativo de desempenho por nível).

## Não-mudanças importantes

- **Nenhuma tabela nova no Supabase.** Favoritos e todo o estado de
  gamificação são derivados do que já está em `progresso_questoes` (via
  `src/lib/progress.ts`, que não muda) ou vivem só em `localStorage`
  (favoritos), replicando exatamente o padrão já usado na plataforma de
  concursos (lá também sem sincronização remota para favoritos).
- **`src/lib/progress.ts` não muda.** Já é idêntico ao da plataforma de
  concursos, exceto por não ter o campo `nivel` — que não faz falta em
  nenhuma das funções portadas.
- **`src/lib/questions.ts` e `src/data/categorias.ts` não mudam.**

## Novo pacote

- `lucide-react` — ícones usados por praticamente todos os componentes novos
  (Star, Trophy, Flame, Target, CheckCircle2, RotateCcw, GraduationCap,
  Rocket). Não é dependência hoje no ENEM.

## Paleta de cores

O ENEM não define os tokens Tailwind customizados `accent`/`warning` usados
na plataforma de concursos (ela também não define, na prática usa classes
Tailwind padrão por baixo). O porte substitui:

- `bg-accent` / `text-accent` / `border-accent` → `bg-gray-600` / `text-gray-300` /
  `border-gray-400`, consistente com o que `QuizPlayer.tsx` e
  `CategoriaExplorer.tsx` já usam para estado "selecionado"/CTA primário.
- `text-warning` / `bg-warning` (usado hoje só para a estrela de favorito e o
  destaque da meta diária) → `text-amber-400` / `bg-amber-500`, consistente
  com o amber já usado em `DificuldadeBadge` (dificuldade média) e
  `CategoryCard` (tier "Média-Alta").
- `emerald`/`rose` (certo/errado) já são idênticos entre os dois projetos —
  sem mudança.

## Lib layer (novos arquivos)

### `src/lib/gamificacao.ts`

Porte de `THOMAZ CONCURSO/src/lib/gamificacao.ts`, removendo:
- `import type { Nivel, Categoria }` → fica só `Categoria`
- `PontoComparativo` e `construirSerieComparativa` (série fundamental×médio)

Mantém sem alteração: `PATENTES` (10 patentes, mesmos thresholds de XP),
`calcularXpTotal`, `calcularPatente`, `diasAtivos`/`calcularSequencia`
(streak), `construirHeatmap`, `META_DIARIA_QUESTOES` (10/dia) e
`calcularProgressoMetaDiaria`/`calcularProgressoMetaSemanal`,
`calcularDesempenhoPorCategoria`/`recomendarCategoria`, `detectarCelebracoes`,
catálogo de conquistas (`calcularConquistas`) e as constantes de marco
(`MARCOS_SEQUENCIA`, `MARCOS_ACERTOS`, `MARCOS_DOMINIO`,
`DOMINADO_MIN_RESPONDIDAS`, `DOMINADO_MIN_ACERTO_PCT`).

`ProgressoMap` precisa passar a ser exportado de `src/lib/progress.ts` (hoje é
um tipo interno) para este módulo poder importá-lo.

### `src/lib/favoritos.ts`

Porte 1:1 de `favoritos.ts`. Única mudança: `STORAGE_KEY` vira
`"enem-questoes-favoritos-v1"` (segue o padrão de nome de chave já usado por
`src/lib/progress.ts`, `"enem-questoes-progresso-v1"`).

### `src/lib/simulado.ts`

Porte 1:1. `TAMANHO_SIMULADO = 20` já corresponde exatamente às 20 categorias
do ENEM — o algoritmo (embaralha categorias, sorteia 1 questão de cada) não
muda em nada.

## Dados

### `src/data/flashcards.json`

Porte filtrado: dos 71 cards da plataforma de concursos, os 61 cujo
`categoriaId` é uma das 20 categorias do ENEM entram; os 10 cards das 4
categorias exclusivas de concurso (`argumentos-silogismos`,
`diagramas-logicos`, `tabelas-verdade`, `verdades-e-mentiras` — lógica de
prova objetiva, não existem no ENEM) ficam de fora. Nenhum card tem campo
`nivel` — já é flat.

## Componentes novos

Todos em `src/components/`, `"use client"` onde precisam de estado/store:

| Componente | Porte de | Adaptação |
|---|---|---|
| `EmptyState.tsx` | idêntico | troca token `accent` |
| `PatenteCard.tsx` | idêntico | troca token `accent` |
| `ConquistasGrid.tsx` | idêntico | troca token `accent` |
| `AtividadeHeatmap.tsx` | idêntico | troca token `accent` (ramp de intensidade em gray/amber) |
| `CelebracaoModal.tsx` | idêntico | troca token `accent` |
| `MetaDiariaCard.tsx` | remove seletor fundamental/médio, `nivelAtivo`, props `dadosFundamental`/`dadosMedio` | recebe `categorias: {categoria, questaoIds}[]` direto (mesmo shape que `DesempenhoView` já usa); href vira `/assuntos/{id}` sem prefixo de nível; troca `warning`→`amber` |
| `RevisaoList.tsx` | remove campo `nivel` de `InfoQuestao` | href vira `/assuntos/{categoriaId}/{id}` |
| `FavoritosList.tsx` | remove campo `nivel` de `InfoQuestao` | href vira `/assuntos/{categoriaId}/{id}`; troca `warning`→`amber` |
| `FlashcardGrid.tsx` | idêntico | troca token `accent` |
| `SimuladoPlayer.tsx` | remove `questao.nivel` do `registrarResposta` (assinatura do ENEM não tem esse parâmetro) | troca `accent`→`gray-600`/branco (CTA), mantém emerald/rose |

## `QuizPlayer.tsx` (existente — não é substituído, é estendido)

Duas adições, preservando o resto do arquivo tal como está hoje (já foi
adaptado nesta sessão para o badge de fonte "ENEM"/"Banco"/"Inédita"):

1. Botão de estrela (favoritar) ao lado da `DificuldadeBadge`, igual ao da
   versão de concursos: `useSyncExternalStore` no `favoritos.ts`,
   `alternarFavorito(questao.id)` no clique.
2. `CelebracaoModal`: captura snapshot de `progress.ts` antes/depois de
   `registrarResposta`, roda `detectarCelebracoes`, empilha e mostra uma por
   vez.

## Rotas novas

Seguindo o padrão App Router flat já usado por `/assuntos`, `/desempenho`,
`/aleatoria`, `/dificuldade`:

- `/simulados` — sorteia com `selecionarSimulado()`, renderiza `SimuladoPlayer`
- `/revisao` — monta `mapaQuestoes` a partir de `todasQuestoes`, renderiza `RevisaoList`
- `/favoritos` — mesmo padrão, renderiza `FavoritosList`
- `/flashcards` — agrupa `flashcards.json` por categoria, renderiza `FlashcardGrid`

Todas protegidas pelo gate de login já existente em `src/proxy.ts` (nenhuma
mudança necessária ali — só `/login`, `/auth/callback` etc. são públicas).

## Integração nas telas existentes

- **`src/components/Navbar.tsx`**: adiciona links Simulados, Flashcards,
  Favoritos, Revisão à lista `links`.
- **`src/app/desempenho/page.tsx` / `DesempenhoView.tsx`**: adiciona
  `PatenteCard`, `AtividadeHeatmap` e `ConquistasGrid` (usando
  `calcularConquistas` com a contagem de categorias dominadas via
  `contarDominadas`) acima do conteúdo atual.
- **`src/app/page.tsx`**: adiciona `MetaDiariaCard` (com
  `recomendarCategoria`) próximo ao topo, usando as 20 categorias direto.

## Testes / validação

- `npx tsc --noEmit` limpo.
- `node scripts/validate.mjs` continua passando (não mexe nos arquivos que ele cobre).
- Checagem ad-hoc: todo `categoriaId` em `flashcards.json` existe em
  `src/data/categorias.ts`.
- Checagem visual via dev server (mesma técnica já usada nesta sessão: bypass
  temporário e reversível do gate de login em `src/proxy.ts` + curl/HTML
  renderizado) para: patente/XP aparecendo em `/desempenho`, simulado
  jogável ponta a ponta, favoritar uma questão e vê-la em `/favoritos`,
  errar uma questão e vê-la em `/revisao`, flashcard virando ao clicar.
