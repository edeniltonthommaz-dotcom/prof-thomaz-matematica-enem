# Sidebar de navegação e home em formato dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the top navbar with a sidebar (desktop fixed + mobile drawer) applied globally, and redesign the home page into a dashboard format (greeting, patente, daily goal, circular progress, metrics carousel, quick access, activity heatmap).

**Architecture:** Port five presentational/stateful components from the sibling project `THOMAZ CONCURSO` (dropping everything tied to its `nivel` dimension, which doesn't exist here), remapping its color tokens to this project's established Tailwind classes. Wire the new `Sidebar` into `src/app/layout.tsx` in place of `Navbar`, and rebuild `src/app/page.tsx` around the new dashboard components plus the three gamification cards that already exist in this project (`PatenteCard`, `MetaDiariaCard`, `AtividadeHeatmap`).

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, `lucide-react` icons, React `useSyncExternalStore` against the existing `src/lib/progress.ts` store. No test framework in this repo — verification is `npx tsc --noEmit`, `node scripts/validate.mjs`, and manual `curl`+grep checks against a dev server (the established convention here).

**Spec:** `docs/superpowers/specs/2026-08-24-sidebar-e-dashboard-home-design.md`

## Global Constraints

- No `nivel` (fundamental/médio) dimension anywhere — this project doesn't have it. Do not port `NivelToggle`, `GrupoExpansivel`, `ComparativoNiveisChart`, or `PerformanceByLevel`.
- Color tokens from the reference project (`accent`, `warning`, `brand-pink`) do not exist in this project's Tailwind config and must be remapped to classes already used here: `bg-gray-600`/`hover:bg-gray-500`/`text-white` for primary CTAs and buttons; `text-gray-200`/`bg-gray-400`/`stroke-gray-400`/`bg-gray-600/20` for secondary highlight/progress/decorative badges; `amber-400`/`amber-500`/`stroke-amber-500` for streak/goal highlight; `emerald`/`rose` stay as-is where already used. Never write `accent`, `warning`, or `brand-pink` classes — they render as nothing (undefined Tailwind classes).
- No test framework — every task's verification step uses `npx tsc --noEmit`, `node scripts/validate.mjs`, and/or a manual dev-server check via curl+grep. No `.test.ts` files.
- Sidebar mounts once in `src/app/layout.tsx` (root layout), not per-page — it covers every route without needing a dynamic route segment.
- No notifications bell (was decorative dead UI even in the reference project) and no `/configuracoes` link (route doesn't exist in this project).

---

## File Structure

**New:**
- `src/components/CircularProgress.tsx` — pure SVG ring, no state.
- `src/components/ProgressoGeralCard.tsx` — wraps `CircularProgress` with this project's stats store.
- `src/components/DashboardHeader.tsx` — greeting + streak badge + avatar.
- `src/components/MetricsCarousel.tsx` — 6-stat horizontal card row / mobile carousel.
- `src/components/QuickAccessCards.tsx` — fixed shortcuts + dynamic "continue last content" card.
- `src/components/Sidebar.tsx` — desktop `<aside>` + mobile top bar, exports `Logo` and `NavLinks` for reuse.
- `src/components/MobileSidebar.tsx` — full-height drawer, imports `Logo`/`NavLinks` from `Sidebar.tsx`.

**Modified:**
- `src/lib/gamificacao.ts` — restore `ProgressoMetaSemanal` type + `calcularProgressoMetaSemanal` (removed as dead code in commit `b4df2f9`, now has a real consumer again).
- `src/app/layout.tsx` — swap `Navbar` for `Sidebar` inside a flex row wrapper.
- `src/app/page.tsx` — becomes `async`, drops the hero/"Origem das questões"/"Assuntos em destaque" sections, assembles the dashboard body.

**Deleted:**
- `src/components/Navbar.tsx` (superseded by `Sidebar.tsx`, no other consumers).
- `src/components/HomeStats.tsx` (superseded by `MetricsCarousel.tsx`, no other consumers).

---

## Task 1: Restore `calcularProgressoMetaSemanal` in `gamificacao.ts`

**Files:**
- Modify: `src/lib/gamificacao.ts`

**Interfaces:**
- Produces: `ProgressoMetaSemanal { atual: number; meta: number; completa: boolean }`, `calcularProgressoMetaSemanal(registros: ProgressoMap, agora?: Date): ProgressoMetaSemanal`. Consumed by Task 4 (`MetricsCarousel.tsx`).

- [ ] **Step 1: Add the type and function back**

Open `src/lib/gamificacao.ts`. Find `calcularProgressoMetaDiaria` (it ends right before the `export interface DesempenhoCategoria` block). Insert this immediately after `calcularProgressoMetaDiaria`'s closing brace, before `export interface DesempenhoCategoria`:

```ts
export interface ProgressoMetaSemanal {
  atual: number;
  meta: number;
  completa: boolean;
}

export function calcularProgressoMetaSemanal(
  registros: ProgressoMap,
  agora: Date = new Date()
): ProgressoMetaSemanal {
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const diasDaJanela = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    diasDaJanela.add(timestampParaDiaLocal(d.getTime()));
  }

  let atual = 0;
  for (const r of Object.values(registros)) {
    if (r?.respondida && diasDaJanela.has(timestampParaDiaLocal(r.timestamp))) atual++;
  }

  const meta = META_DIARIA_QUESTOES * 7;
  return { atual, meta, completa: atual >= meta };
}
```

This is a straight restore of what commit `b4df2f9` removed — `timestampParaDiaLocal` and `META_DIARIA_QUESTOES` are already defined earlier in the same file.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `gamificacao.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/gamificacao.ts
git commit -m "Restore calcularProgressoMetaSemanal for the new MetricsCarousel"
```

---

## Task 2: Create `CircularProgress.tsx`

**Files:**
- Create: `src/components/CircularProgress.tsx`

**Interfaces:**
- Produces: `<CircularProgress pct={number} size?={number} strokeWidth?={number} label?={string} corDestaque?={"verde"|"amarelo"} />`. Consumed by Task 3 (`ProgressoGeralCard.tsx`).

- [ ] **Step 1: Write the component**

```tsx
export default function CircularProgress({
  pct,
  size = 140,
  strokeWidth = 12,
  label,
  corDestaque = "verde",
}: {
  pct: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  corDestaque?: "verde" | "amarelo";
}) {
  const pctClamped = Math.max(0, Math.min(100, pct));
  const raio = (size - strokeWidth) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia * (1 - pctClamped / 100);
  const corTraco = corDestaque === "amarelo" ? "stroke-amber-500" : "stroke-gray-400";

  return (
    <div className="flex flex-col items-center" role="img" aria-label={label ?? `${pctClamped}% concluído`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          strokeWidth={strokeWidth}
          className="fill-none stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          className={`fill-none motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-out ${corTraco}`}
        />
      </svg>
      <div className="-mt-[5.5rem] text-center">
        <span className="text-2xl font-bold text-white">{pctClamped}%</span>
      </div>
      {label && <p className="mt-1 text-xs text-slate-400">{label}</p>}
    </div>
  );
}
```

Note the color remap from the reference component: `stroke-accent` → `stroke-gray-400` (secondary highlight, matches the progress-bar color already used in `PatenteCard.tsx`), `stroke-warning` → `stroke-amber-500` (matches `MetaDiariaCard.tsx`'s progress bar).

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `CircularProgress.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CircularProgress.tsx
git commit -m "Add CircularProgress component"
```

---

## Task 3: Create `ProgressoGeralCard.tsx`

**Files:**
- Create: `src/components/ProgressoGeralCard.tsx`

**Interfaces:**
- Consumes: `CircularProgress` (Task 2); `calcularEstatisticas`, `subscribe`, `getSnapshot`, `getServerSnapshot` from `@/lib/progress`; `Categoria` from `@/lib/types`.
- Produces: `<ProgressoGeralCard categorias={{categoria: Categoria; questaoIds: string[]}[]} />`. Consumed by Task 9 (`page.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot, calcularEstatisticas } from "@/lib/progress";
import CircularProgress from "@/components/CircularProgress";
import type { Categoria } from "@/lib/types";

export default function ProgressoGeralCard({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const questaoIds = useMemo(() => categorias.flatMap((c) => c.questaoIds), [categorias]);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);
  const total = questaoIds.length;
  const pct = total > 0 ? Math.round((stats.respondidas / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
      <CircularProgress pct={pct} label="concluído" corDestaque={pct >= 70 ? "verde" : "amarelo"} />
      <p className="mt-4 text-sm text-slate-300">
        {stats.respondidas} de {total} questões
      </p>
      <Link
        href="/desempenho"
        className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
      >
        Ver desempenho
      </Link>
    </div>
  );
}
```

This drops `dadosFundamental`/`dadosMedio`/`nivelAtivo` from the reference (no `nivel` dimension here) and instead takes the same `{categoria, questaoIds}[]` shape that `MetaDiariaCard.tsx` and `HomeStats.tsx` already use, deriving the flat id list via `flatMap` — same pattern `HomeStats.tsx` uses, so passing the same `categoriasComQuestoes` array reference to multiple dashboard components lets React dedupe the RSC payload.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `ProgressoGeralCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProgressoGeralCard.tsx
git commit -m "Add ProgressoGeralCard component"
```

---

## Task 4: Create `MetricsCarousel.tsx`

**Files:**
- Create: `src/components/MetricsCarousel.tsx`

**Interfaces:**
- Consumes: `calcularEstatisticas`, `subscribe`, `getSnapshot`, `getServerSnapshot` from `@/lib/progress`; `calcularSequencia`, `diasAtivos`, `calcularProgressoMetaSemanal` from `@/lib/gamificacao` (Task 1); `Categoria` from `@/lib/types`.
- Produces: `<MetricsCarousel categorias={{categoria: Categoria; questaoIds: string[]}[]} />`. Consumed by Task 9 (`page.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2, XCircle, Percent, Flame, Target, CalendarCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularSequencia, diasAtivos, calcularProgressoMetaSemanal } from "@/lib/gamificacao";
import type { Categoria } from "@/lib/types";

interface Indicador {
  icon: LucideIcon;
  valor: string;
  label: string;
}

export default function MetricsCarousel({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const questaoIds = useMemo(() => categorias.flatMap((c) => c.questaoIds), [categorias]);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);
  const sequencia = useMemo(() => calcularSequencia(diasAtivos(registros)), [registros]);
  const metaSemanal = useMemo(() => calcularProgressoMetaSemanal(registros), [registros]);

  const indicadores: Indicador[] = [
    { icon: CheckCircle2, valor: stats.respondidas.toLocaleString("pt-BR"), label: "Questões respondidas" },
    { icon: Target, valor: stats.acertos.toLocaleString("pt-BR"), label: "Acertos" },
    { icon: XCircle, valor: (stats.respondidas - stats.acertos).toLocaleString("pt-BR"), label: "Erros" },
    { icon: Percent, valor: stats.acertoPct !== null ? `${stats.acertoPct}%` : "—", label: "Taxa de acerto" },
    { icon: Flame, valor: `${sequencia.atual}`, label: sequencia.atual === 1 ? "dia seguido" : "dias seguidos" },
    { icon: CalendarCheck, valor: `${metaSemanal.atual}/${metaSemanal.meta}`, label: "Meta semanal" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  function aoRolar() {
    const el = scrollRef.current;
    if (!el || el.children.length < 2) return;
    const primeiro = el.children[0] as HTMLElement;
    const segundo = el.children[1] as HTMLElement;
    const passo = segundo.offsetLeft - primeiro.offsetLeft;
    if (passo <= 0) return;
    const indice = Math.round((el.scrollLeft + el.clientWidth / 2 - primeiro.offsetWidth / 2) / passo);
    setIndiceAtivo(Math.max(0, Math.min(indicadores.length - 1, indice)));
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={aoRolar}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 max-sm:grid-cols-none max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:[scrollbar-width:none]"
      >
        {indicadores.map((ind) => {
          const Icon = ind.icon;
          return (
            <div
              key={ind.label}
              className="max-sm:w-[85vw] max-sm:shrink-0 max-sm:snap-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <Icon className="mb-2 h-4 w-4 text-gray-400" />
              <p className="text-2xl font-bold text-white">{ind.valor}</p>
              <p className="text-xs text-slate-400">{ind.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {indicadores.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === indiceAtivo ? "bg-gray-400" : "bg-white/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
```

Color remap: `text-accent`/`bg-accent` → `text-gray-400`/`bg-gray-400` (secondary highlight, same group as Task 2/3). Takes `categorias` (grouped shape) instead of the reference's flat `questaoIdsGlobal`, deriving the flat list via `flatMap` — same reasoning as Task 3.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `MetricsCarousel.tsx`. This also confirms `calcularProgressoMetaSemanal` from Task 1 is correctly exported and typed.

- [ ] **Step 3: Commit**

```bash
git add src/components/MetricsCarousel.tsx
git commit -m "Add MetricsCarousel component"
```

---

## Task 5: Create `DashboardHeader.tsx`

**Files:**
- Create: `src/components/DashboardHeader.tsx`

**Interfaces:**
- Consumes: `subscribe`, `getSnapshot`, `getServerSnapshot` from `@/lib/progress`; `diasAtivos`, `calcularSequencia` from `@/lib/gamificacao`.
- Produces: `<DashboardHeader user={User | null} />`. Consumed by Task 9 (`page.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { diasAtivos, calcularSequencia } from "@/lib/gamificacao";

export default function DashboardHeader({ user }: { user: User | null }) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sequencia = useMemo(() => calcularSequencia(diasAtivos(registros)), [registros]);

  const nome: string =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "Visitante";
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;
  const primeiroNome = nome.split(" ")[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {primeiroNome}!</h1>
        <p className="text-sm text-slate-400">Vamos avançar mais um pouco hoje?</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
          title={`${sequencia.atual} ${sequencia.atual === 1 ? "dia seguido" : "dias seguidos"}`}
        >
          <Flame className={`h-3.5 w-3.5 ${sequencia.atual > 0 ? "text-amber-400" : "text-slate-500"}`} />
          {sequencia.atual}
        </span>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={nome} width={36} height={36} className="h-9 w-9 rounded-full" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600/20 text-sm font-semibold text-gray-200">
            {primeiroNome.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
```

Two deliberate deviations from the reference component, both already decided in the spec: (1) the notification bell button is dropped entirely — it was decorative dead UI even there; (2) the streak flame uses `text-amber-400` (this project's streak/goal highlight color, already used the same way in `AtividadeHeatmap.tsx`) instead of the reference's `text-accent`. The avatar fallback badge uses `bg-gray-600/20 text-gray-200`, the same decorative-badge pattern `CelebracaoModal.tsx` already uses in this project, replacing the reference's `bg-brand-pink/20 text-brand-pink` (no equivalent token here). The outer `mb-8` from the reference is dropped — spacing between dashboard sections is handled by the `space-y-8` wrapper added in Task 9, not by each component.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `DashboardHeader.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/DashboardHeader.tsx
git commit -m "Add DashboardHeader component"
```

---

## Task 6: Create `QuickAccessCards.tsx`

**Files:**
- Create: `src/components/QuickAccessCards.tsx`

**Interfaces:**
- Consumes: `resolverInfoQuestao`, `type MapaQuestoesCompacto` from `@/lib/mapaQuestoes`; `subscribe`, `getSnapshot`, `getServerSnapshot` from `@/lib/progress`.
- Produces: `<QuickAccessCards mapaQuestoes={MapaQuestoesCompacto} />`. Consumed by Task 9 (`page.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { BookOpen, Layers, ClipboardList, PlayCircle, type LucideIcon } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { resolverInfoQuestao, type MapaQuestoesCompacto } from "@/lib/mapaQuestoes";

interface Atalho {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  href: string;
}

function ultimaCategoriaRespondida(
  registros: ReturnType<typeof getSnapshot>,
  mapaQuestoes: MapaQuestoesCompacto
) {
  let melhorId: string | null = null;
  let melhorTimestamp = -Infinity;
  for (const [id, r] of Object.entries(registros)) {
    if (r?.respondida && r.timestamp > melhorTimestamp) {
      melhorId = id;
      melhorTimestamp = r.timestamp;
    }
  }
  return melhorId ? resolverInfoQuestao(mapaQuestoes, melhorId) : undefined;
}

export default function QuickAccessCards({ mapaQuestoes }: { mapaQuestoes: MapaQuestoesCompacto }) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ultimaCategoria = useMemo(
    () => ultimaCategoriaRespondida(registros, mapaQuestoes),
    [registros, mapaQuestoes]
  );

  const atalhos: Atalho[] = [
    { icon: BookOpen, titulo: "Assuntos", descricao: "Explore as 20 categorias do ENEM", href: "/assuntos" },
    { icon: Layers, titulo: "Flashcards", descricao: "Revise fórmulas e conceitos", href: "/flashcards" },
    {
      icon: ClipboardList,
      titulo: "Simulado",
      descricao: "Questões variadas entre todos os assuntos",
      href: "/simulados",
    },
    ...(ultimaCategoria
      ? [
          {
            icon: PlayCircle,
            titulo: "Continuar último conteúdo",
            descricao: ultimaCategoria.categoriaNome,
            href: `/assuntos/${ultimaCategoria.categoriaId}`,
          },
        ]
      : []),
  ];

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-white">Acesso rápido</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {atalhos.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.titulo}
              href={a.href}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-white">{a.titulo}</p>
                <p className="text-xs text-slate-400">{a.descricao}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

Two deviations from the reference: (1) fixed shortcuts are `Assuntos`/`Flashcards`/`Simulado` (no fundamental×médio duplication — no `nivel` dimension here) instead of four level-specific cards; (2) "last content" lookup uses `resolverInfoQuestao`/`MapaQuestoesCompacto` (the compact encoding already used by `/revisao` and `/favoritos` in this project) instead of a `Record` keyed by every question id — a `Record` covering all ~1639 questions would repeat the ~200KB RSC-payload problem already fixed for those two pages in commit `b4df2f9`. Hover uses `hover:bg-white/[0.06]` (this project's established card-hover pattern, e.g. the old "Assuntos em destaque" section in `page.tsx`) instead of the reference's `hover:border-accent`.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `QuickAccessCards.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/QuickAccessCards.tsx
git commit -m "Add QuickAccessCards component"
```

---

## Task 7: Create `Sidebar.tsx` + `MobileSidebar.tsx`

These two files are mutually dependent (`Sidebar` renders `MobileSidebar`; `MobileSidebar` imports `Logo`/`NavLinks` from `Sidebar`) and only make sense reviewed together, so they're one task.

**Files:**
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/MobileSidebar.tsx`

**Interfaces:**
- Consumes: `AuthButton` (existing, `src/components/AuthButton.tsx`, prop `initialUser: User | null`).
- Produces:
  - `<Sidebar user={User | null} />` (default export). Consumed by Task 8 (`layout.tsx`).
  - `Logo(): JSX.Element` and `NavLinks({ pathname: string; onNavigate?: () => void }): JSX.Element` (named exports from `Sidebar.tsx`), consumed internally by `MobileSidebar.tsx`.
  - `<MobileSidebar aberto={boolean} onFechar={() => void} user={User | null} pathname={string} />` (default export from `MobileSidebar.tsx`), consumed internally by `Sidebar.tsx`.

- [ ] **Step 1: Write `src/components/Sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Home,
  Target,
  BookOpen,
  Gauge,
  ClipboardList,
  Layers,
  RotateCcw,
  Star,
  BarChart3,
  Menu,
  type LucideIcon,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";
import MobileSidebar from "@/components/MobileSidebar";

interface ItemNav {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: ItemNav[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/#meta-diaria", label: "Meta Diária", icon: Target },
  { href: "/assuntos", label: "Assuntos", icon: BookOpen },
  { href: "/dificuldade", label: "Dificuldade", icon: Gauge },
  { href: "/simulados", label: "Simulados", icon: ClipboardList },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/revisao", label: "Revisão", icon: RotateCcw },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/desempenho", label: "Meu Desempenho", icon: BarChart3 },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <Image
        src="/logo/thomaz-branca.png"
        alt="Thomaz"
        width={394}
        height={319}
        className="h-9 w-auto"
        priority
      />
      <span className="block leading-tight">
        <span className="block text-sm font-semibold text-white">Prof. Thomaz</span>
        <span className="block text-[11px] text-slate-400">
          Matemática ENEM
          <br />
          1000+ questões
        </span>
      </span>
    </Link>
  );
}

export function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" onClick={onNavigate}>
      {NAV_ITEMS.map((item) => {
        const ativo = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              ativo ? "bg-white/[0.06] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${ativo ? "text-gray-200" : "text-slate-400"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0b1120]/95 px-4 py-3 backdrop-blur sticky top-0 z-10 lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <MobileSidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} user={user} pathname={pathname} />

      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64 lg:shrink-0 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:border-r lg:border-white/10 lg:bg-[#0b1120] lg:px-4 lg:py-6">
        <Logo />
        <NavLinks pathname={pathname} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <AuthButton initialUser={user} />
        </div>
      </aside>
    </>
  );
}
```

This drops `NivelToggle`, `GrupoExpansivel`, and the `nivel` prop entirely — the nav list is a flat array built straight from `Navbar.tsx`'s existing 8 links plus `Meta Diária` (`/#meta-diaria`, matching the anchor `MetaDiariaCard.tsx` already exposes via `id="meta-diaria"`), 9 items total. `Dificuldade` has no icon in the reference (it never had that link), so it uses `Gauge` from `lucide-react`. Active-link color uses `text-gray-200` (secondary-highlight group, Task 2/3/4's color) rather than the reference's `text-warning`, since amber is reserved here for streak/goal emphasis specifically (see Task 5).

- [ ] **Step 2: Write `src/components/MobileSidebar.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AuthButton from "@/components/AuthButton";
import { Logo, NavLinks } from "@/components/Sidebar";

export default function MobileSidebar({
  aberto,
  onFechar,
  user,
  pathname,
}: {
  aberto: boolean;
  onFechar: () => void;
  user: User | null;
  pathname: string;
}) {
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onFechar}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="relative flex h-full w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-white/10 bg-[#0b1120] px-4 py-6"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onFechar}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks pathname={pathname} onNavigate={onFechar} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <AuthButton initialUser={user} />
        </div>
      </aside>
    </div>
  );
}
```

Closes by Esc keydown (listener added/removed in a `useEffect`, same pattern `CelebracaoModal.tsx` already uses in this project) or backdrop click. Drops `animate-celebracao-card` from the reference — that class comes from a keyframe defined only in the reference project's Tailwind config; this project has no comparable animation utilities defined anywhere (`globals.css` has none), so the drawer opens without a slide-in transition rather than referencing an undefined class.

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `Sidebar.tsx` or `MobileSidebar.tsx`. (This also confirms the circular import between the two files resolves cleanly — both only reference each other inside component bodies, not at module-eval time, so TypeScript/webpack handle it fine.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Sidebar.tsx src/components/MobileSidebar.tsx
git commit -m "Add Sidebar and MobileSidebar navigation components"
```

---

## Task 8: Wire `Sidebar` into `layout.tsx`, delete `Navbar.tsx`

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `Sidebar` (Task 7).

- [ ] **Step 1: Update `src/app/layout.tsx`**

Replace the `Navbar` import:

```tsx
import Navbar from "@/components/Navbar";
```

with:

```tsx
import Sidebar from "@/components/Sidebar";
```

Then replace the body content:

```tsx
      <body className="min-h-full flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
      </body>
```

with:

```tsx
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1 flex-col lg:flex-row">
          <Sidebar user={user} />
          <div className="min-w-0 flex-1">
            <main>{children}</main>
          </div>
        </div>
      </body>
```

The rest of `layout.tsx` (font setup, `metadata`, the `createClient()`/`getUser()` call at the top of `RootLayout`) is unchanged.

- [ ] **Step 2: Delete `src/components/Navbar.tsx`**

```bash
git rm src/components/Navbar.tsx
```

Confirm nothing else imports it:

Run: `grep -rn "components/Navbar" src/`
Expected: no output.

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check — sidebar renders on every route**

Run: `npm run dev -- -p 3100` in the background, then:

```bash
curl -s http://localhost:3100/ | grep -o 'Meu Desempenho'
curl -s http://localhost:3100/assuntos | grep -o 'Meu Desempenho'
curl -s http://localhost:3100/desempenho | grep -o 'Meu Desempenho'
```

Expected: each command prints `Meu Desempenho` (confirms the sidebar's server-rendered markup — including a link only the new `Sidebar` has — appears on `/`, `/assuntos`, and `/desempenho`). Stop the dev server afterward.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Replace Navbar with Sidebar in the root layout"
```

(The `Navbar.tsx` deletion from Step 2 is already staged via `git rm`; it will be included in this commit.)

---

## Task 9: Rewrite `page.tsx` as the dashboard home, delete `HomeStats.tsx`

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/HomeStats.tsx`

**Interfaces:**
- Consumes: `DashboardHeader` (Task 5), `ProgressoGeralCard` (Task 3), `MetricsCarousel` (Task 4), `QuickAccessCards` (Task 6), `PatenteCard`/`MetaDiariaCard`/`AtividadeHeatmap` (existing, unchanged); `construirMapaQuestoesCompacto` from `@/lib/mapaQuestoes`; `createClient` from `@/lib/supabase/server` (same import already used in `layout.tsx`).

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { categorias } from "@/data/categorias";
import { todasQuestoes, questoesPorCategoria } from "@/lib/questions";
import { construirMapaQuestoesCompacto } from "@/lib/mapaQuestoes";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/DashboardHeader";
import PatenteCard from "@/components/PatenteCard";
import MetaDiariaCard from "@/components/MetaDiariaCard";
import ProgressoGeralCard from "@/components/ProgressoGeralCard";
import MetricsCarousel from "@/components/MetricsCarousel";
import QuickAccessCards from "@/components/QuickAccessCards";
import AtividadeHeatmap from "@/components/AtividadeHeatmap";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categoriasComQuestoes = categorias.map((c) => ({
    categoria: c,
    questaoIds: questoesPorCategoria(c.id).map((q) => q.id),
  }));
  const nomeCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
  const mapaQuestoesCompacto = construirMapaQuestoesCompacto(todasQuestoes, nomeCategoria);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <DashboardHeader user={user} />
      <PatenteCard />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <MetaDiariaCard categorias={categoriasComQuestoes} />
        <ProgressoGeralCard categorias={categoriasComQuestoes} />
      </div>
      <MetricsCarousel categorias={categoriasComQuestoes} />
      <QuickAccessCards mapaQuestoes={mapaQuestoesCompacto} />
      <AtividadeHeatmap />
    </div>
  );
}
```

This deletes the hero section, "Origem das questões", and "Assuntos em destaque" entirely (all removed per the spec — the app is entirely behind login, no marketing section needed, and the dashboard format replaces the informational sections). `categoriasComQuestoes` is built exactly as before and the same array reference is passed to `MetaDiariaCard`, `ProgressoGeralCard`, and `MetricsCarousel`. `mapaQuestoesCompacto` is built the same way `/revisao/page.tsx` already builds it.

- [ ] **Step 2: Delete `src/components/HomeStats.tsx`**

```bash
git rm src/components/HomeStats.tsx
```

Confirm nothing else imports it:

Run: `grep -rn "components/HomeStats" src/`
Expected: no output.

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Validate the question data is still intact**

Run: `node scripts/validate.mjs`
Expected: passes (this task doesn't touch question data, but it's a cheap sanity check that nothing in the import graph broke).

- [ ] **Step 5: Manual check — dashboard renders correctly on the home page**

Run: `npm run dev -- -p 3100` in the background, then:

```bash
curl -s http://localhost:3100/ > /tmp/home.html
grep -o 'Olá, ' /tmp/home.html
grep -o 'Patente [0-9]' /tmp/home.html
grep -o 'Meta de Hoje' /tmp/home.html
grep -o 'concluído' /tmp/home.html
grep -o 'Questões respondidas' /tmp/home.html
grep -o 'Acesso rápido' /tmp/home.html
grep -o 'Dias de Estudo' /tmp/home.html
grep -o 'Prof. Thomaz — Matemática ENEM' /tmp/home.html
```

Expected: the first seven all print at least one match (`DashboardHeader`, `PatenteCard`, `MetaDiariaCard`, `ProgressoGeralCard`'s "concluído" label from `CircularProgress`, `MetricsCarousel`, `QuickAccessCards`, `AtividadeHeatmap`). The last line (old hero headline) should print **no** match — confirms the hero is gone.

```bash
grep -c 'Explorar por Assunto' /tmp/home.html
```

Expected: `0`.

Stop the dev server afterward.

- [ ] **Step 6: Manual check — QuickAccessCards payload stays small**

Same running dev server as Step 5, or restart it:

```bash
curl -s http://localhost:3100/ | wc -c
```

Expected: comparable in order of magnitude to the pre-existing `/revisao` and `/favoritos` page sizes (tens of KB, not hundreds) — confirms `mapaQuestoesCompacto`'s compact encoding kept `QuickAccessCards`' RSC payload contribution small, same as those two pages after the `b4df2f9` fix. If it's unexpectedly large (500KB+), re-check that `QuickAccessCards.tsx` uses `resolverInfoQuestao`/`MapaQuestoesCompacto` and not a per-question `Record`.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "Rewrite home page as a dashboard"
```

(The `HomeStats.tsx` deletion from Step 2 is already staged via `git rm`; it will be included in this commit.)

---

## Self-Review Notes

- **Spec coverage:** every component listed in the spec's "Componentes a criar" section has a task (`Sidebar`/`MobileSidebar` → Task 7, `CircularProgress` → Task 2, `ProgressoGeralCard` → Task 3, `MetricsCarousel` → Task 4, `QuickAccessCards` → Task 6, `DashboardHeader` → Task 5); both "Alterações em arquivos existentes" (`layout.tsx`, `page.tsx`) have tasks (8, 9); the `gamificacao.ts` restore has a task (1); both deletions (`Navbar.tsx`, `HomeStats.tsx`) are folded into the tasks that make them dead code (8, 9) rather than left dangling.
- **Type consistency checked:** `categorias: {categoria: Categoria; questaoIds: string[]}[]` is the exact shape used consistently across `MetaDiariaCard` (existing), `ProgressoGeralCard` (Task 3), and `MetricsCarousel` (Task 4). `MapaQuestoesCompacto`/`resolverInfoQuestao` signatures in Task 6 match `src/lib/mapaQuestoes.ts` exactly (verified against the existing file, not the reference project). `ProgressoMetaSemanal`/`calcularProgressoMetaSemanal` in Task 1 match Task 4's import exactly.
- **No placeholders:** every step has literal code or an exact runnable command.
