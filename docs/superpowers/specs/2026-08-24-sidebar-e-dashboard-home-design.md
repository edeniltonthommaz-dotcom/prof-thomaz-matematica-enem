# Sidebar de navegação e home em formato dashboard

**Contexto:** a plataforma irmã `prof-thomaz-matematica-concursos` (pasta `THOMAZ CONCURSO`) usa uma sidebar fixa de navegação (com drawer no mobile) e uma home em formato dashboard (saudação, patente, meta diária, progresso circular, métricas em carrossel, acesso rápido, heatmap de atividade). O usuário pediu para trazer esse modelo de layout para a plataforma ENEM, que hoje usa uma navbar no topo e uma home com banner de hero + estatísticas simples.

**Objetivo:** substituir a navbar por uma sidebar (desktop fixa + drawer mobile) aplicada globalmente, e redesenhar a home para o formato dashboard da referência — reaproveitando os componentes de gamificação que já existem aqui (`PatenteCard`, `MetaDiariaCard`, `AtividadeHeatmap`) e portando os que faltam, todos sem a dimensão `nivel` (que não existe neste projeto) e com os tokens de cor remapeados para a paleta já estabelecida aqui.

**Fora de escopo:** `ComparativoNiveisChart` e `PerformanceByLevel` (específicos de nivel fundamental×médio, sem equivalente aqui) e o `NivelToggle`/`GrupoExpansivel` da sidebar de referência (existem só por causa da dimensão nivel).

## Decisões já tomadas com o usuário

- A sidebar entra em `src/app/layout.tsx` (mesmo lugar onde a `Navbar` já vive hoje), cobrindo todas as rotas de uma vez — diferente da referência, que monta a sidebar por página porque lá o `nivel` é um segmento de rota dinâmico. Como este projeto não tem essa dimensão, colocar a sidebar no layout raiz é mais simples e correto.
- A home remove o banner de hero atual e vai direto para o formato dashboard, já que o app inteiro fica atrás de login (não há necessidade de uma seção de marketing).
- O cartão "Meta semanal" do `MetricsCarousel` é mantido — `calcularProgressoMetaSemanal`/`ProgressoMetaSemanal`, removidos de `gamificacao.ts` como código morto na sessão anterior (antes de se saber que seriam reaproveitados aqui), voltam a ser adicionados.
- `QuickAccessCards` usa atalhos fixos sem duplicação por nível: Assuntos, Flashcards, Simulado, e "Continuar último conteúdo" (dinâmico, só aparece se houver histórico).
- O botão de notificações (sino) do `DashboardHeader` de referência não tem nenhuma função — é decorativo mesmo lá. Omitido aqui para não criar UI morta.
- As seções atuais "Origem das questões" e "Assuntos em destaque" (sem equivalente na referência) são removidas — a home fica 100% no formato dashboard.
- `HomeStats.tsx` é aposentado: seu papel (resolvidas/acertos) é coberto e ampliado pelo `MetricsCarousel`. Como não sobra nenhum outro consumidor, o componente é deletado.

## Componentes a criar

Todos com os tokens de cor da referência (`accent`, `warning`, `brand-pink`) remapeados para a paleta já usada neste projeto: `bg-gray-600`/`hover:bg-gray-500`/`text-white` (CTAs primários), `text-gray-200`/`bg-gray-400`/`stroke-gray-400` (destaque secundário/progresso), `amber-400`/`amber-500`/`stroke-amber-500` (destaque de sequência/meta), `emerald`/`rose` (inalterados).

### `src/components/Sidebar.tsx`

Porta de `THOMAZ CONCURSO/src/components/Sidebar.tsx`, sem `NivelToggle` nem `GrupoExpansivel` — os links já existentes em `Navbar.tsx` viram uma lista plana (`Início`, `Meta Diária` → `/#meta-diaria`, `Assuntos`, `Dificuldade`, `Simulados`, `Flashcards`, `Revisão`, `Favoritos`, `Meu Desempenho`), renderizados por um componente `NavLinks` interno (como na referência). No desktop, `<aside>` fixo de 16rem de largura à esquerda, sticky, com logo no topo e `AuthButton` no rodapé. No mobile, um `<header>` sticky com logo + botão hamburger que abre o `MobileSidebar`.

**Interfaces:**
- Consome: `User | null` (mesmo tipo que `Navbar` já recebe de `layout.tsx`).
- Produz: `<Sidebar user={User | null} />`. Consumido por `src/app/layout.tsx`.

### `src/components/MobileSidebar.tsx`

Porta direta de `THOMAZ CONCURSO/src/components/MobileSidebar.tsx`, sem `NivelToggle`. Drawer full-height por cima do conteúdo, com backdrop; fecha por Esc (listener de `keydown` com cleanup, mesmo padrão já usado no `CelebracaoModal` desta sessão) ou clique no backdrop.

**Interfaces:**
- Consome: `NavLinks` exportado por `Sidebar.tsx`.
- Produz: `<MobileSidebar aberto={boolean} onFechar={() => void} user={User | null} pathname={string} />`. Consumido por `Sidebar.tsx`.

### `src/components/CircularProgress.tsx`

Porta direta e inalterada de `THOMAZ CONCURSO/src/components/CircularProgress.tsx` (componente puro, sem lógica de domínio) — só troca `stroke-accent`/`stroke-warning` por `stroke-gray-400`/`stroke-amber-500`.

**Interfaces:**
- Produz: `<CircularProgress pct={number} size?={number} strokeWidth?={number} label?={string} corDestaque?={"verde"|"amarelo"} />`. Consumido por `ProgressoGeralCard.tsx`.

### `src/components/ProgressoGeralCard.tsx`

Adaptado de `THOMAZ CONCURSO/src/components/ProgressoGeralCard.tsx`, sem `nivelAtivo`/`dadosFundamental`/`dadosMedio` — recebe a mesma forma agrupada `{categoria, questaoIds}[]` que `MetaDiariaCard` e `HomeStats` já usam, e deriva a lista plana internamente via `flatMap` (mesmo padrão do `HomeStats` corrigido nesta sessão, para reaproveitar a mesma referência de array entre os componentes do dashboard e deixar o dedup do RSC funcionar).

**Interfaces:**
- Consome: `calcularEstatisticas` de `@/lib/progress`.
- Produz: `<ProgressoGeralCard categorias={{categoria: Categoria; questaoIds: string[]}[]} />`. Consumido pela home.

### `src/components/MetricsCarousel.tsx`

Porta de `THOMAZ CONCURSO/src/components/MetricsCarousel.tsx`, adaptado para receber `categorias` (mesma forma agrupada, `flatMap` interno) em vez de `questaoIdsGlobal` direto — mesma razão do item anterior.

**Interfaces:**
- Consome: `calcularEstatisticas` de `@/lib/progress`; `calcularSequencia`, `diasAtivos`, `calcularProgressoMetaSemanal` de `@/lib/gamificacao` (a última precisa ser restaurada — ver seção "Alteração em `gamificacao.ts`").
- Produz: `<MetricsCarousel categorias={{categoria: Categoria; questaoIds: string[]}[]} />`. Consumido pela home.

### `src/components/QuickAccessCards.tsx`

Adaptado de `THOMAZ CONCURSO/src/components/QuickAccessCards.tsx`: atalhos fixos sem duplicação por nível (Assuntos → `/assuntos`, Flashcards → `/flashcards`, Simulado → `/simulados`), mais um atalho dinâmico "Continuar último conteúdo" apontando para a categoria da questão mais recentemente respondida, quando houver.

Para achar essa categoria sem repetir o problema de payload de ~200KB corrigido em `/revisao`/`/favoritos` nesta mesma sessão, usa o encoding compacto já existente em `src/lib/mapaQuestoes.ts` (`MapaQuestoesCompacto`/`resolverInfoQuestao`) em vez de um `Record` com todas as ~1639 questões.

**Interfaces:**
- Consome: `resolverInfoQuestao`, `type MapaQuestoesCompacto` de `@/lib/mapaQuestoes`; `subscribe`/`getSnapshot`/`getServerSnapshot` de `@/lib/progress`.
- Produz: `<QuickAccessCards mapaQuestoes={MapaQuestoesCompacto} />`. Consumido pela home.

### `src/components/DashboardHeader.tsx`

Porta de `THOMAZ CONCURSO/src/components/DashboardHeader.tsx`, sem o botão de notificações (decorativo na referência, omitido aqui). Saudação com primeiro nome do usuário (ou "Visitante"), indicador de sequência de dias, avatar (foto do Google ou inicial).

**Interfaces:**
- Consome: `subscribe`/`getSnapshot`/`getServerSnapshot` de `@/lib/progress`; `diasAtivos`/`calcularSequencia` de `@/lib/gamificacao`.
- Produz: `<DashboardHeader user={User | null} />`. Consumido pela home.

## Alterações em arquivos existentes

### `src/app/layout.tsx`

Troca `<Navbar user={user} />` + `<main className="flex-1">{children}</main>` por uma estrutura em linha com `Sidebar`:

```tsx
<div className="flex flex-1 flex-col lg:flex-row">
  <Sidebar user={user} />
  <div className="min-w-0 flex-1">
    <main>{children}</main>
  </div>
</div>
```

`Navbar.tsx` é deletado (sem outros consumidores).

### `src/app/page.tsx` (home)

Passa a ser `async`, busca `user` via `createClient()` de `@/lib/supabase/server` (mesmo padrão do `layout.tsx` e da home de referência). Remove o hero, "Origem das questões" e "Assuntos em destaque". Novo corpo:

```tsx
<DashboardHeader user={user} />
<PatenteCard />
<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
  <MetaDiariaCard categorias={categoriasComQuestoes} />
  <ProgressoGeralCard categorias={categoriasComQuestoes} />
</div>
<MetricsCarousel categorias={categoriasComQuestoes} />
<QuickAccessCards mapaQuestoes={mapaQuestoesCompacto} />
<AtividadeHeatmap />
```

`categoriasComQuestoes` continua construído como já é hoje (`categorias.map(c => ({categoria: c, questaoIds: questoesPorCategoria(c.id).map(q => q.id)}))`) e a mesma referência é passada a `MetaDiariaCard`, `ProgressoGeralCard` e `MetricsCarousel`. `mapaQuestoesCompacto` é construído com `construirMapaQuestoesCompacto(todasQuestoes, nomeCategoria)`, igual já é feito em `/revisao` e `/favoritos`.

`HomeStats.tsx` é deletado (sem outros consumidores após esta mudança).

### `src/lib/gamificacao.ts`

Restaura `ProgressoMetaSemanal`/`calcularProgressoMetaSemanal`, removidos nesta mesma sessão como código morto — passam a ter um consumidor real (`MetricsCarousel`).

## Testes / verificação

Sem framework de testes neste projeto (convenção já estabelecida) — `npx tsc --noEmit`, `node scripts/validate.mjs`, e um passo de verificação manual via curl+grep contra um servidor de dev (mesma técnica já usada nesta sessão), cobrindo:
- Sidebar aparece em toda rota (checar `/`, `/assuntos`, `/desempenho`) com os 8 links certos.
- Home renderiza `DashboardHeader`, `PatenteCard`, `MetaDiariaCard`, `ProgressoGeralCard` (gráfico circular), `MetricsCarousel` (6 cartões), `QuickAccessCards`, `AtividadeHeatmap`, e nenhum resquício do hero antigo.
- `MetricsCarousel` mostra o cartão de meta semanal sem erros de tipo.
- `QuickAccessCards` não estoura o payload da home (medir o tamanho do `mapaQuestoesCompacto` serializado, como já foi feito para `/revisao`/`/favoritos`).
