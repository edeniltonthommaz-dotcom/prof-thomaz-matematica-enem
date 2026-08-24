# Gamificação e Ferramentas de Estudo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port gamification (XP/patentes/conquistas/streak/heatmap/meta diária), simulados, revisão, favoritos, and flashcards from the sister `prof-thomaz-matematica-concursos` platform into the ENEM platform, with the `nivel` (fundamental/médio) dimension stripped out everywhere.

**Architecture:** New pure-logic lib modules (`gamificacao.ts`, `favoritos.ts`, `simulado.ts`) sit alongside the existing `progress.ts` (unchanged except exporting one type) and derive all gamification state from data already recorded there or from `localStorage`. New presentational components consume those modules via `useSyncExternalStore`. Four new flat routes (`/simulados`, `/revisao`, `/favoritos`, `/flashcards`) plus additions to two existing pages (`/`, `/desempenho`) and the existing `QuizPlayer`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind, `lucide-react` (new dependency), no new Supabase tables.

**Spec:** `docs/superpowers/specs/2026-08-24-gamificacao-e-ferramentas-estudo-design.md`

## Global Constraints

- No new Supabase tables or migrations — everything derives from `progresso_questoes` (already synced via `src/lib/progress.ts`) or lives in `localStorage` (favoritos, unsynced, same as the reference platform).
- No `nivel` dimension anywhere in ported code — no nivel toggle UI, no nivel-keyed routes, no nivel param on `registrarResposta`.
- Color tokens: replace every `accent`/`warning`/`accent-foreground`/`warning-foreground` Tailwind class from the reference code with this project's existing palette — `bg-gray-600`/`hover:bg-gray-500`/`text-white` for primary CTAs and "selected" states, `text-gray-200`/`bg-gray-400` for secondary accent/progress-bar fills, `amber-400`/`amber-500` for meta-diária and favorito-star highlights, `emerald`/`rose` (unchanged) for correct/incorrect.
- This project has no test framework (no vitest/jest, verified — `grep` for `"test"` in `package.json` and `find src -iname "*.test.*"` both come up empty). Follow that existing convention: verify pure logic with a throwaway Node script (delete after, like the ad-hoc validation done earlier for `banco.json`), verify UI with `tsc --noEmit` plus a manual browser walkthrough (temporary reversible bypass of `src/proxy.ts`'s login gate + `curl`/HTML-grep or an actual browser, then revert the bypass) — do not add a test framework as part of this plan.
- `E:\1A-CLAUDECODE\THOMAZ CONCURSO` is the reference implementation for every port in this plan; treat its files as read-only source, never modify them.

---

### Task 1: Add `lucide-react` dependency

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)

**Interfaces:**
- Produces: the `lucide-react` package, used by every task from Task 8 onward (`Star`, `Trophy`, `Flame`, `Target`, `CheckCircle2`, `RotateCcw`, `GraduationCap`, `Rocket` icons).

- [ ] **Step 1: Install the package**

Run: `npm install lucide-react@^1.33.0`

- [ ] **Step 2: Verify it resolves**

Run: `node -e "require.resolve('lucide-react')"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add lucide-react dependency for gamification icons"
```

---

### Task 2: Export `ProgressoMap` from `src/lib/progress.ts`

**Files:**
- Modify: `src/lib/progress.ts:15`

**Interfaces:**
- Produces: `export type ProgressoMap = Record<string, RegistroResposta>;` — consumed by `src/lib/gamificacao.ts` (Task 4) and every component that types a `registros` prop against it.

- [ ] **Step 1: Export the type**

In `src/lib/progress.ts`, change line 15 from:

```ts
type ProgressoMap = Record<string, RegistroResposta>;
```

to:

```ts
export type ProgressoMap = Record<string, RegistroResposta>;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this is a pure widening of visibility, nothing consumes it yet).

- [ ] **Step 3: Commit**

```bash
git add src/lib/progress.ts
git commit -m "Export ProgressoMap type for use by the gamification module"
```

---

### Task 3: Add `Flashcard` type to `src/lib/types.ts`

**Files:**
- Modify: `src/lib/types.ts` (append after the `Resumo` interface, end of file)

**Interfaces:**
- Produces: `Flashcard { id, categoriaId, subtopico, frente, verso }` — consumed by `src/data/flashcards.json` (Task 7) and `FlashcardGrid.tsx` (Task 13).

- [ ] **Step 1: Append the type**

Add to the end of `src/lib/types.ts`:

```ts

export interface Flashcard {
  id: string;
  categoriaId: string;
  subtopico: string;
  frente: string;
  verso: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "Add Flashcard type"
```

---

### Task 4: Port `src/lib/gamificacao.ts`

**Files:**
- Create: `src/lib/gamificacao.ts`

**Interfaces:**
- Consumes: `ProgressoMap` from `@/lib/progress` (Task 2), `Categoria` from `@/lib/types`.
- Produces: `PATENTES`, `Patente`, `StatusPatente`, `calcularXpTotal(registros): number`, `calcularPatente(xpTotal): StatusPatente`, `diasAtivos(registros): Set<string>`, `calcularSequencia(dias, agora?): {atual, recorde}`, `construirHeatmap(registros, semanas?, agora?): DiaAtividade[]`, `META_DIARIA_QUESTOES`, `calcularProgressoMetaDiaria(registros, agora?)`, `calcularProgressoMetaSemanal(registros, agora?)`, `calcularDesempenhoPorCategoria(registros, categorias): DesempenhoCategoria[]`, `recomendarCategoria(desempenho): Categoria | null`, `Celebracao` (union type), `detectarCelebracoes(antes, depois, agora?): Celebracao[]`, `DOMINADO_MIN_RESPONDIDAS`, `DOMINADO_MIN_ACERTO_PCT`, `contarDominadas(porCategoria): number`, `MARCOS_DOMINIO`, `GrupoConquista`, `Conquista`, `StatusConquista`, `calcularConquistas(registros, dominadas, totalCategorias, agora?): StatusConquista[]`. All consumed by Tasks 9–12, 14, 17, 18, 24.

This is a direct port of `E:\1A-CLAUDECODE\THOMAZ CONCURSO\src\lib\gamificacao.ts` with the nivel-comparison chart removed (`Nivel` import, `PontoComparativo` interface, `construirSerieComparativa` function — the fundamental×médio comparison, out of scope per the spec).

- [ ] **Step 1: Write the file**

```ts
import type { ProgressoMap } from "@/lib/progress";
import type { Categoria } from "@/lib/types";

export interface Patente {
  numero: number;
  titulo: string;
  xpAcumuladoParaEntrar: number;
}

export const PATENTES: readonly Patente[] = [
  { numero: 1, titulo: "Iniciante", xpAcumuladoParaEntrar: 0 },
  { numero: 2, titulo: "Aprendiz", xpAcumuladoParaEntrar: 100 },
  { numero: 3, titulo: "Estudioso", xpAcumuladoParaEntrar: 250 },
  { numero: 4, titulo: "Dedicado", xpAcumuladoParaEntrar: 450 },
  { numero: 5, titulo: "Avançado", xpAcumuladoParaEntrar: 700 },
  { numero: 6, titulo: "Especialista", xpAcumuladoParaEntrar: 1050 },
  { numero: 7, titulo: "Estrategista", xpAcumuladoParaEntrar: 1500 },
  { numero: 8, titulo: "Mestre em Matemática", xpAcumuladoParaEntrar: 2100 },
  { numero: 9, titulo: "Referência", xpAcumuladoParaEntrar: 2900 },
  { numero: 10, titulo: "Aprovado", xpAcumuladoParaEntrar: 4000 },
];

export interface StatusPatente {
  patente: Patente;
  xpTotal: number;
  proximaPatente: Patente | null;
  xpNaPatenteAtual: number;
  xpNecessarioProximaPatente: number | null;
  progressoPct: number;
}

export function calcularXpTotal(registros: ProgressoMap): number {
  let xp = 0;
  for (const r of Object.values(registros)) {
    if (!r?.respondida) continue;
    xp += r.correta ? 10 : 2;
  }
  return xp;
}

export function calcularPatente(xpTotal: number): StatusPatente {
  let atual = PATENTES[0];
  for (const p of PATENTES) {
    if (p.xpAcumuladoParaEntrar <= xpTotal) atual = p;
    else break;
  }
  const proxima = PATENTES[atual.numero] ?? null;

  const xpNaPatenteAtual = xpTotal - atual.xpAcumuladoParaEntrar;
  const xpNecessarioProximaPatente = proxima
    ? proxima.xpAcumuladoParaEntrar - atual.xpAcumuladoParaEntrar
    : null;

  const progressoPct = proxima
    ? Math.min(100, Math.round((xpNaPatenteAtual / xpNecessarioProximaPatente!) * 100))
    : 100;

  return {
    patente: atual,
    xpTotal,
    proximaPatente: proxima,
    xpNaPatenteAtual,
    xpNecessarioProximaPatente,
    progressoPct,
  };
}

export function timestampParaDiaLocal(timestamp: number): string {
  const d = new Date(timestamp);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function diaParaIndiceEpoch(dia: string): number {
  const [ano, mes, dd] = dia.split("-").map(Number);
  return Math.floor(Date.UTC(ano, mes - 1, dd) / 86_400_000);
}

export function diasAtivos(registros: ProgressoMap): Set<string> {
  const dias = new Set<string>();
  for (const r of Object.values(registros)) {
    if (!r?.respondida) continue;
    dias.add(timestampParaDiaLocal(r.timestamp));
  }
  return dias;
}

export interface StatusSequencia {
  atual: number;
  recorde: number;
}

export function calcularSequencia(dias: Set<string>, agora: Date = new Date()): StatusSequencia {
  if (dias.size === 0) return { atual: 0, recorde: 0 };

  const indices = new Set(Array.from(dias, diaParaIndiceEpoch));
  const hojeStr = timestampParaDiaLocal(agora.getTime());
  const hoje = diaParaIndiceEpoch(hojeStr);

  let atual = 0;
  if (indices.has(hoje)) {
    let cursor = hoje;
    while (indices.has(cursor)) {
      atual++;
      cursor--;
    }
  } else if (indices.has(hoje - 1)) {
    let cursor = hoje - 1;
    while (indices.has(cursor)) {
      atual++;
      cursor--;
    }
  }

  const ordenados = Array.from(indices).sort((a, b) => a - b);
  let recorde = 0;
  let corrente = 0;
  let anterior: number | null = null;
  for (const idx of ordenados) {
    corrente = anterior !== null && idx === anterior + 1 ? corrente + 1 : 1;
    recorde = Math.max(recorde, corrente);
    anterior = idx;
  }
  recorde = Math.max(recorde, atual);

  return { atual, recorde };
}

export interface DiaAtividade {
  data: string;
  contagem: number;
}

export function construirHeatmap(
  registros: ProgressoMap,
  semanas: number = 27,
  agora: Date = new Date()
): DiaAtividade[] {
  const contagemPorDia = new Map<string, number>();
  for (const r of Object.values(registros)) {
    if (!r?.respondida) continue;
    const dia = timestampParaDiaLocal(r.timestamp);
    contagemPorDia.set(dia, (contagemPorDia.get(dia) ?? 0) + 1);
  }

  const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  fim.setDate(fim.getDate() + (6 - fim.getDay())); // sábado da semana atual

  const totalDias = semanas * 7;
  const inicio = new Date(fim);
  inicio.setDate(inicio.getDate() - (totalDias - 1));

  const resultado: DiaAtividade[] = [];
  const cursor = new Date(inicio);
  for (let i = 0; i < totalDias; i++) {
    const dia = timestampParaDiaLocal(cursor.getTime());
    resultado.push({ data: dia, contagem: contagemPorDia.get(dia) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return resultado;
}

export const MARCOS_SEQUENCIA = [3, 7, 14, 30, 60, 100, 180, 365] as const;
export const MARCOS_ACERTOS = [10, 50, 100, 250, 500, 1000] as const;

export function calcularTotalAcertos(registros: ProgressoMap): number {
  let acertos = 0;
  for (const r of Object.values(registros)) {
    if (r?.respondida && r.correta) acertos++;
  }
  return acertos;
}

export const META_DIARIA_QUESTOES = 10;

export interface ProgressoMetaDiaria {
  atual: number;
  meta: number;
  completa: boolean;
}

export function contarRespondidasNoDia(registros: ProgressoMap, dia: string): number {
  let n = 0;
  for (const r of Object.values(registros)) {
    if (r?.respondida && timestampParaDiaLocal(r.timestamp) === dia) n++;
  }
  return n;
}

export function calcularProgressoMetaDiaria(
  registros: ProgressoMap,
  agora: Date = new Date()
): ProgressoMetaDiaria {
  const atual = contarRespondidasNoDia(registros, timestampParaDiaLocal(agora.getTime()));
  return { atual, meta: META_DIARIA_QUESTOES, completa: atual >= META_DIARIA_QUESTOES };
}

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

export interface DesempenhoCategoria {
  categoria: Categoria;
  stats: { respondidas: number; acertos: number; acertoPct: number | null };
}

export function calcularDesempenhoPorCategoria(
  registros: ProgressoMap,
  categorias: { categoria: Categoria; questaoIds: string[] }[]
): DesempenhoCategoria[] {
  return categorias.map(({ categoria, questaoIds }) => {
    let respondidas = 0;
    let acertos = 0;
    for (const id of questaoIds) {
      const r = registros[id];
      if (r?.respondida) {
        respondidas++;
        if (r.correta) acertos++;
      }
    }
    return {
      categoria,
      stats: { respondidas, acertos, acertoPct: respondidas > 0 ? Math.round((acertos / respondidas) * 100) : null },
    };
  });
}

function categoriasNaoDominadasOrdenadas(desempenho: DesempenhoCategoria[]): Categoria[] {
  const naoDominadas = desempenho.filter(
    (d) =>
      !(
        d.stats.respondidas >= DOMINADO_MIN_RESPONDIDAS &&
        (d.stats.acertoPct ?? 0) >= DOMINADO_MIN_ACERTO_PCT
      )
  );
  const comTentativas = naoDominadas
    .filter((d) => d.stats.respondidas > 0)
    .sort((a, b) => (a.stats.acertoPct ?? 0) - (b.stats.acertoPct ?? 0));
  const semTentativas = naoDominadas.filter((d) => d.stats.respondidas === 0);
  return [...comTentativas, ...semTentativas].map((d) => d.categoria);
}

export function recomendarCategoria(desempenho: DesempenhoCategoria[]): Categoria | null {
  return categoriasNaoDominadasOrdenadas(desempenho)[0] ?? null;
}

export type Celebracao =
  | { tipo: "patente"; patente: Patente }
  | { tipo: "streak"; dias: number }
  | { tipo: "conquista"; titulo: string; descricao: string }
  | { tipo: "meta"; quantidade: number };

/** Menor marco da lista que "depois" atinge mas "antes" ainda não atingia. */
function marcoCruzado(antes: number, depois: number, marcos: readonly number[]): number | null {
  for (const m of marcos) {
    if (antes < m && depois >= m) return m;
  }
  return null;
}

export function detectarCelebracoes(
  antes: ProgressoMap,
  depois: ProgressoMap,
  agora: Date = new Date()
): Celebracao[] {
  const celebracoes: Celebracao[] = [];

  const patenteAntes = calcularPatente(calcularXpTotal(antes)).patente;
  const patenteDepois = calcularPatente(calcularXpTotal(depois)).patente;
  if (patenteDepois.numero > patenteAntes.numero) {
    celebracoes.push({ tipo: "patente", patente: patenteDepois });
  }

  const sequenciaAntes = calcularSequencia(diasAtivos(antes), agora).atual;
  const sequenciaDepois = calcularSequencia(diasAtivos(depois), agora).atual;
  if (sequenciaDepois > sequenciaAntes && (MARCOS_SEQUENCIA as readonly number[]).includes(sequenciaDepois)) {
    celebracoes.push({ tipo: "streak", dias: sequenciaDepois });
  }

  const respondidasAntes = Object.values(antes).filter((r) => r?.respondida).length;
  const respondidasDepois = Object.values(depois).filter((r) => r?.respondida).length;
  if (respondidasAntes === 0 && respondidasDepois > 0) {
    celebracoes.push({
      tipo: "conquista",
      titulo: "Primeira questão",
      descricao: "Você respondeu sua primeira questão",
    });
  }

  const marcoAcertos = marcoCruzado(calcularTotalAcertos(antes), calcularTotalAcertos(depois), MARCOS_ACERTOS);
  if (marcoAcertos !== null) {
    celebracoes.push({
      tipo: "conquista",
      titulo: `${marcoAcertos} acertos`,
      descricao: `Você já acertou ${marcoAcertos} questões`,
    });
  }

  const hoje = timestampParaDiaLocal(agora.getTime());
  const metaAntes = contarRespondidasNoDia(antes, hoje);
  const metaDepois = contarRespondidasNoDia(depois, hoje);
  if (metaAntes < META_DIARIA_QUESTOES && metaDepois >= META_DIARIA_QUESTOES) {
    celebracoes.push({ tipo: "meta", quantidade: META_DIARIA_QUESTOES });
  }

  return celebracoes;
}

export const DOMINADO_MIN_RESPONDIDAS = 5;
export const DOMINADO_MIN_ACERTO_PCT = 80;

export function contarDominadas(porCategoria: { stats: { respondidas: number; acertoPct: number | null } }[]): number {
  return porCategoria.filter(
    (c) =>
      c.stats.respondidas >= DOMINADO_MIN_RESPONDIDAS &&
      (c.stats.acertoPct ?? 0) >= DOMINADO_MIN_ACERTO_PCT
  ).length;
}

export const MARCOS_DOMINIO = [1, 5, 10] as const;

export type GrupoConquista = "inicio" | "sequencia" | "acertos" | "dominio";

export interface Conquista {
  id: string;
  grupo: GrupoConquista;
  titulo: string;
  descricao: string;
}

export interface StatusConquista extends Conquista {
  desbloqueada: boolean;
  progresso?: { atual: number; meta: number };
}

function catalogoConquistas(totalCategorias: number): Conquista[] {
  return [
    { id: "inicio-1", grupo: "inicio", titulo: "Primeira questão", descricao: "Responda sua primeira questão" },
    ...MARCOS_SEQUENCIA.map((dias) => ({
      id: `sequencia-${dias}`,
      grupo: "sequencia" as const,
      titulo: `${dias} dias seguidos`,
      descricao: `Estude ${dias} dias seguidos`,
    })),
    ...MARCOS_ACERTOS.map((n) => ({
      id: `acertos-${n}`,
      grupo: "acertos" as const,
      titulo: `${n} acertos`,
      descricao: `Acerte ${n} questões no total`,
    })),
    ...MARCOS_DOMINIO.map((n) => ({
      id: `dominio-${n}`,
      grupo: "dominio" as const,
      titulo: n === 1 ? "Primeiro assunto dominado" : `${n} assuntos dominados`,
      descricao: `Domine ${n} assunto${n > 1 ? "s" : ""}`,
    })),
    {
      id: "dominio-todos",
      grupo: "dominio",
      titulo: "Domínio total",
      descricao: `Domine os ${totalCategorias} assuntos da trilha`,
    },
  ];
}

export function calcularConquistas(
  registros: ProgressoMap,
  dominadas: number,
  totalCategorias: number,
  agora: Date = new Date()
): StatusConquista[] {
  const totalRespondidas = Object.values(registros).filter((r) => r?.respondida).length;
  const totalAcertos = calcularTotalAcertos(registros);
  const recordeSequencia = calcularSequencia(diasAtivos(registros), agora).recorde;

  return catalogoConquistas(totalCategorias).map((c) => {
    if (c.grupo === "inicio") {
      return { ...c, desbloqueada: totalRespondidas >= 1 };
    }
    if (c.grupo === "sequencia") {
      const meta = Number(c.id.split("-")[1]);
      return { ...c, desbloqueada: recordeSequencia >= meta, progresso: { atual: recordeSequencia, meta } };
    }
    if (c.grupo === "acertos") {
      const meta = Number(c.id.split("-")[1]);
      return { ...c, desbloqueada: totalAcertos >= meta, progresso: { atual: totalAcertos, meta } };
    }
    // dominio
    const meta = c.id === "dominio-todos" ? totalCategorias : Number(c.id.split("-")[1]);
    return { ...c, desbloqueada: totalCategorias > 0 && dominadas >= meta, progresso: { atual: dominadas, meta } };
  });
}
```

Note: `calcularDesempenhoPorCategoria`'s return `stats` shape is inlined here (not imported from `progress.ts`'s `EstatisticasGerais`) to avoid a circular/unused-type situation — it has the same three fields (`respondidas`, `acertos`, `acertoPct`) so it's a drop-in match for every consumer.

- [ ] **Step 2: Write and run a throwaway verification script**

Create `scripts/_tmp-verify-gamificacao.mjs` (temporary, deleted in Step 4):

```js
import assert from "node:assert/strict";
import {
  calcularXpTotal,
  calcularPatente,
  calcularSequencia,
  diasAtivos,
  construirHeatmap,
  calcularProgressoMetaDiaria,
  detectarCelebracoes,
  contarDominadas,
  calcularConquistas,
} from "../src/lib/gamificacao.ts";

// XP: 3 acertos (30) + 1 erro (2) = 32
const registros = {
  q1: { respondida: true, correta: true, alternativaEscolhida: "A", timestamp: Date.now() },
  q2: { respondida: true, correta: true, alternativaEscolhida: "A", timestamp: Date.now() },
  q3: { respondida: true, correta: true, alternativaEscolhida: "A", timestamp: Date.now() },
  q4: { respondida: true, correta: false, alternativaEscolhida: "B", timestamp: Date.now() },
};
assert.equal(calcularXpTotal(registros), 32);

// Patente: 32 XP fica na patente 1 (Iniciante, threshold 0..100)
assert.equal(calcularPatente(32).patente.numero, 1);
assert.equal(calcularPatente(100).patente.numero, 2);
assert.equal(calcularPatente(4000).patente.numero, 10);
assert.equal(calcularPatente(4000).proximaPatente, null);

// Sequência: um único dia ativo hoje = streak de 1
const hoje = new Date("2026-08-24T12:00:00");
const registrosHoje = {
  q1: { respondida: true, correta: true, alternativaEscolhida: "A", timestamp: hoje.getTime() },
};
assert.equal(calcularSequencia(diasAtivos(registrosHoje), hoje).atual, 1);

// Heatmap: pede N semanas, retorna N*7 dias
const heat = construirHeatmap(registrosHoje, 4, hoje);
assert.equal(heat.length, 28);

// Meta diária: 10 questões respondidas hoje = completa
const registros10 = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [
    `q${i}`,
    { respondida: true, correta: true, alternativaEscolhida: "A", timestamp: hoje.getTime() },
  ])
);
assert.equal(calcularProgressoMetaDiaria(registros10, hoje).completa, true);

// Celebração: cruzar 10 acertos dispara conquista "10 acertos"
const antes = {};
const depois = registros10;
const celebs = detectarCelebracoes(antes, depois, hoje);
assert.ok(celebs.some((c) => c.tipo === "conquista" && c.titulo === "10 acertos"));
assert.ok(celebs.some((c) => c.tipo === "meta"));

// Domínio: 1 categoria com 5 respondidas e 100% de acerto = 1 dominada
const dominadas = contarDominadas([{ stats: { respondidas: 5, acertoPct: 100 } }, { stats: { respondidas: 2, acertoPct: 100 } }]);
assert.equal(dominadas, 1);

// Conquistas: catálogo não vazio e a de "primeira questão" desbloqueada com respondidas >= 1
const conquistas = calcularConquistas(registros10, dominadas, 20, hoje);
assert.ok(conquistas.length > 0);
assert.ok(conquistas.find((c) => c.id === "inicio-1")?.desbloqueada);

console.log("OK: gamificacao.ts — todas as verificações passaram");
```

Run: `node --experimental-strip-types scripts/_tmp-verify-gamificacao.mjs`
Expected: `OK: gamificacao.ts — todas as verificações passaram`, exit code 0. If the Node version in use doesn't support `--experimental-strip-types`, compile with `npx tsc scripts/_tmp-verify-gamificacao.mjs --outDir /tmp/verify --module esnext --target es2022 --moduleResolution bundler` and run the emitted `.mjs` instead — adjust the relative import path accordingly.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Delete the throwaway script**

```bash
rm scripts/_tmp-verify-gamificacao.mjs
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamificacao.ts
git commit -m "Port gamificacao.ts from the concursos platform (no nivel dimension)"
```

---

### Task 5: Port `src/lib/favoritos.ts`

**Files:**
- Create: `src/lib/favoritos.ts`

**Interfaces:**
- Produces: `FavoritosSet`, `getSnapshot()`, `getServerSnapshot()`, `subscribe(listener)`, `isFavorito(questaoId)`, `alternarFavorito(questaoId)`. Consumed by `QuizPlayer.tsx` (Task 18) and `FavoritosList.tsx` (Task 16).

Direct port of `E:\1A-CLAUDECODE\THOMAZ CONCURSO\src\lib\favoritos.ts`, only the storage key changes.

- [ ] **Step 1: Write the file**

```ts
const STORAGE_KEY = "enem-questoes-favoritos-v1";

export type FavoritosSet = Record<string, true>;

const EMPTY: FavoritosSet = {};
let cache: FavoritosSet | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): FavoritosSet {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoritosSet) : {};
  } catch {
    return {};
  }
}

function apply(set: FavoritosSet) {
  cache = set;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
  }
  listeners.forEach((l) => l());
}

export function getSnapshot(): FavoritosSet {
  if (!cache) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): FavoritosSet {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isFavorito(questaoId: string): boolean {
  return !!getSnapshot()[questaoId];
}

export function alternarFavorito(questaoId: string) {
  const set = { ...getSnapshot() };
  if (set[questaoId]) delete set[questaoId];
  else set[questaoId] = true;
  apply(set);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/favoritos.ts
git commit -m "Port favoritos.ts from the concursos platform"
```

---

### Task 6: Port `src/lib/simulado.ts`

**Files:**
- Create: `src/lib/simulado.ts`

**Interfaces:**
- Consumes: `todasQuestoes` from `@/lib/questions`.
- Produces: `TAMANHO_SIMULADO = 20`, `selecionarSimulado(): Questao[]`. Consumed by the `/simulados` route (Task 19).

Direct port, unchanged — already flat, and `TAMANHO_SIMULADO = 20` exactly matches the ENEM platform's 20 categories.

- [ ] **Step 1: Write the file**

```ts
import { todasQuestoes } from "./questions";
import type { Questao } from "./types";

export const TAMANHO_SIMULADO = 20;

/** Sorteia até TAMANHO_SIMULADO categorias distintas e 1 questão aleatória de cada, para garantir variedade real entre assuntos. */
export function selecionarSimulado(): Questao[] {
  const porCategoria = new Map<string, Questao[]>();
  for (const q of todasQuestoes) {
    const lista = porCategoria.get(q.categoriaId);
    if (lista) lista.push(q);
    else porCategoria.set(q.categoriaId, [q]);
  }

  const categorias = [...porCategoria.keys()];
  for (let i = categorias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categorias[i], categorias[j]] = [categorias[j], categorias[i]];
  }

  return categorias.slice(0, Math.min(TAMANHO_SIMULADO, categorias.length)).map((categoriaId) => {
    const lista = porCategoria.get(categoriaId)!;
    return lista[Math.floor(Math.random() * lista.length)];
  });
}
```

- [ ] **Step 2: Verify category coverage with a throwaway script**

Create `scripts/_tmp-verify-simulado.mjs`:

```js
import assert from "node:assert/strict";
import { selecionarSimulado, TAMANHO_SIMULADO } from "../src/lib/simulado.ts";

const questoes = selecionarSimulado();
assert.equal(questoes.length, TAMANHO_SIMULADO);
const categoriasUnicas = new Set(questoes.map((q) => q.categoriaId));
assert.equal(categoriasUnicas.size, questoes.length, "categorias devem ser distintas");

console.log("OK: simulado.ts —", questoes.length, "questões,", categoriasUnicas.size, "categorias distintas");
```

Run: `node --experimental-strip-types scripts/_tmp-verify-simulado.mjs` (or the `tsc`-compile fallback described in Task 4 Step 2).
Expected: `OK: simulado.ts — 20 questões, 20 categorias distintas`.

- [ ] **Step 3: Delete the throwaway script**

```bash
rm scripts/_tmp-verify-simulado.mjs
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/simulado.ts
git commit -m "Port simulado.ts from the concursos platform"
```

---

### Task 7: Generate `src/data/flashcards.json`

**Files:**
- Create: `src/data/flashcards.json`

**Interfaces:**
- Produces: `Flashcard[]` (61 entries) matching the `Flashcard` type from Task 3. Consumed by the `/flashcards` route (Task 22).

Filtered from `E:\1A-CLAUDECODE\THOMAZ CONCURSO\src\data\flashcards.json` (71 entries) — the 10 cards belonging to the 4 concurso-only logic categories (`argumentos-silogismos`, `diagramas-logicos`, `tabelas-verdade`, `verdades-e-mentiras`) are dropped since those categories don't exist in the ENEM platform. No card has a `nivel` field, so no other transform is needed.

- [ ] **Step 1: Run the filter script**

```bash
node -e "
const fs = require('fs');
const categoriasEnem = require('./src/data/categorias.ts'.replace('.ts', '.js'));
" 2>/dev/null; node -e "
const fs = require('fs');
const src = JSON.parse(fs.readFileSync('../THOMAZ CONCURSO/src/data/flashcards.json', 'utf8'));
const idsEnem = new Set([
  'numeros','porcentagem','razao-proporcao','regra-de-tres','equacoes','funcao-afim',
  'funcao-quadratica','exponenciais-logaritmos','progressoes','geometria-plana',
  'geometria-espacial','geometria-analitica','trigonometria','estatistica','probabilidade',
  'analise-combinatoria','matematica-financeira','matrizes','logica','conjuntos'
]);
const out = src.filter((c) => idsEnem.has(c.categoriaId));
fs.writeFileSync('src/data/flashcards.json', JSON.stringify(out, null, 2) + '\n');
console.log('wrote', out.length, 'flashcards (dropped', src.length - out.length, ')');
"
```

Expected output: `wrote 61 flashcards (dropped 10)`. (Run this from the ENEM project root, since the script reads `../THOMAZ CONCURSO/...` relative to it.)

- [ ] **Step 2: Verify every categoriaId matches a real ENEM category**

```bash
node -e "
const fs = require('fs');
const flashcards = JSON.parse(fs.readFileSync('src/data/flashcards.json', 'utf8'));
const categoriaIds = new Set(fs.readFileSync('src/data/categorias.ts', 'utf8').match(/id: \"([a-z-]+)\"/g).map((m) => m.slice(5, -1)));
const invalid = flashcards.filter((c) => !categoriaIds.has(c.categoriaId));
if (invalid.length > 0) { console.error('INVALID', invalid); process.exit(1); }
console.log('OK: all', flashcards.length, 'flashcards map to a real categoriaId');
"
```

Expected: `OK: all 61 flashcards map to a real categoriaId`.

- [ ] **Step 3: Commit**

```bash
git add src/data/flashcards.json
git commit -m "Add flashcards.json (61 cards, filtered from the concursos platform)"
```

---

### Task 8: Create `EmptyState.tsx`

**Files:**
- Create: `src/components/EmptyState.tsx`

**Interfaces:**
- Produces: `<EmptyState icon={LucideIcon} titulo={string} descricao={string} acao?={{href, label}} />`. Consumed by `RevisaoList.tsx` (Task 15) and `FavoritosList.tsx` (Task 16).

Direct port, `bg-accent`/`text-accent-foreground` → `bg-gray-600`/`text-white` (matches the primary-CTA convention already used across the app).

- [ ] **Step 1: Write the file**

```tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  acao,
}: {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  acao?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-400">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mb-1 text-lg font-semibold text-white">{titulo}</h2>
      <p className="max-w-sm text-sm text-slate-400">{descricao}</p>
      {acao && (
        <Link
          href={acao.href}
          className="mt-6 rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-500"
        >
          {acao.label}
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (component isn't consumed yet, but must typecheck standalone).

- [ ] **Step 3: Commit**

```bash
git add src/components/EmptyState.tsx
git commit -m "Add EmptyState component"
```

---

### Task 9: Create `PatenteCard.tsx`

**Files:**
- Create: `src/components/PatenteCard.tsx`

**Interfaces:**
- Consumes: `subscribe`/`getSnapshot`/`getServerSnapshot` from `@/lib/progress`, `calcularXpTotal`/`calcularPatente`/`PATENTES` from `@/lib/gamificacao` (Task 4).
- Produces: `<PatenteCard />` (no props). Consumed by `DesempenhoView.tsx` (Task 24).

Port with `accent` → `gray-400`/`gray-200`/`gray-600`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularXpTotal, calcularPatente, PATENTES } from "@/lib/gamificacao";

export default function PatenteCard() {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const xpTotal = useMemo(() => calcularXpTotal(registros), [registros]);
  const statusPatente = useMemo(() => calcularPatente(xpTotal), [xpTotal]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-600/30 text-xl font-bold text-gray-200">
            {statusPatente.patente.numero}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Patente {statusPatente.patente.numero}
            </p>
            <p className="text-xl font-bold text-white">{statusPatente.patente.titulo}</p>
          </div>
        </div>
        <div className="min-w-[14rem] flex-1">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>Progresso da patente</span>
            <span>
              {statusPatente.proximaPatente
                ? `${statusPatente.xpNaPatenteAtual} / ${statusPatente.xpNecessarioProximaPatente} XP`
                : `${statusPatente.xpTotal} XP`}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gray-400"
              style={{ width: `${statusPatente.progressoPct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {statusPatente.proximaPatente
              ? `Faltam ${
                  statusPatente.xpNecessarioProximaPatente! - statusPatente.xpNaPatenteAtual
                } XP para ${statusPatente.proximaPatente.titulo}`
              : "Patente máxima atingida"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {PATENTES.map((p) => {
          const atingida = p.numero <= statusPatente.patente.numero;
          return (
            <span
              key={p.numero}
              title={`Patente ${p.numero}: ${p.titulo}`}
              className={`h-3 w-3 rounded-full ${
                atingida ? "bg-gray-400" : "border border-white/15 bg-white/5"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PatenteCard.tsx
git commit -m "Add PatenteCard component"
```

---

### Task 10: Create `ConquistasGrid.tsx`

**Files:**
- Create: `src/components/ConquistasGrid.tsx`

**Interfaces:**
- Consumes: `GrupoConquista`, `StatusConquista` from `@/lib/gamificacao` (Task 4).
- Produces: `<ConquistasGrid conquistas={StatusConquista[]} />`. Consumed by `DesempenhoView.tsx` (Task 24).

- [ ] **Step 1: Write the file**

```tsx
import { Rocket, Flame, Target, GraduationCap, type LucideIcon } from "lucide-react";
import type { GrupoConquista, StatusConquista } from "@/lib/gamificacao";

const ICONE_POR_GRUPO: Record<GrupoConquista, LucideIcon> = {
  inicio: Rocket,
  sequencia: Flame,
  acertos: Target,
  dominio: GraduationCap,
};

const TITULO_GRUPO: Record<GrupoConquista, string> = {
  inicio: "Primeiros passos",
  sequencia: "Sequência de estudos",
  acertos: "Total de acertos",
  dominio: "Domínio de assuntos",
};

const ORDEM_GRUPOS: GrupoConquista[] = ["inicio", "sequencia", "acertos", "dominio"];

export default function ConquistasGrid({ conquistas }: { conquistas: StatusConquista[] }) {
  return (
    <div className="space-y-6">
      {ORDEM_GRUPOS.map((grupo) => {
        const doGrupo = conquistas.filter((c) => c.grupo === grupo);
        if (doGrupo.length === 0) return null;
        const Icone = ICONE_POR_GRUPO[grupo];

        return (
          <div key={grupo}>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">{TITULO_GRUPO[grupo]}</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {doGrupo.map((c) => (
                <div
                  key={c.id}
                  title={c.descricao}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${
                    c.desbloqueada
                      ? "border-gray-400/40 bg-gray-400/10"
                      : "border-white/10 bg-white/[0.02] opacity-60"
                  }`}
                >
                  <Icone
                    className={`h-5 w-5 shrink-0 ${c.desbloqueada ? "text-gray-200" : "text-slate-500"}`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-xs font-semibold ${
                        c.desbloqueada ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {c.titulo}
                    </p>
                    {!c.desbloqueada && c.progresso && (
                      <p className="text-[11px] text-slate-500">
                        {c.progresso.atual} / {c.progresso.meta}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ConquistasGrid.tsx
git commit -m "Add ConquistasGrid component"
```

---

### Task 11: Create `AtividadeHeatmap.tsx`

**Files:**
- Create: `src/components/AtividadeHeatmap.tsx`

**Interfaces:**
- Consumes: `diasAtivos`/`calcularSequencia`/`construirHeatmap` from `@/lib/gamificacao` (Task 4).
- Produces: `<AtividadeHeatmap />` (no props). Consumed by `DesempenhoView.tsx` (Task 24).

Port with `accent` → gray intensity ramp, flame icon → `amber-400` (streak highlight, per the spec's color mapping).

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Flame } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { diasAtivos, calcularSequencia, construirHeatmap } from "@/lib/gamificacao";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function corPorContagem(n: number): string {
  if (n === 0) return "bg-white/5";
  if (n === 1) return "bg-gray-400/30";
  if (n <= 3) return "bg-gray-400/60";
  return "bg-gray-400";
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function AtividadeHeatmap() {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dias = useMemo(() => diasAtivos(registros), [registros]);
  const sequencia = useMemo(() => calcularSequencia(dias), [dias]);
  const heatmapDados = useMemo(() => construirHeatmap(registros), [registros]);

  const semanas = chunk(heatmapDados, 7);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Dias de Estudo</h2>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className={`h-3.5 w-3.5 ${sequencia.atual > 0 ? "text-amber-400" : "text-slate-500"}`} />
            {sequencia.atual} {sequencia.atual === 1 ? "dia seguido" : "dias seguidos"}
          </span>
          <span>Recorde: {sequencia.recorde} {sequencia.recorde === 1 ? "dia" : "dias"}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div
            className="grid h-3 gap-[3px] text-[10px] leading-3 text-slate-500"
            style={{ gridTemplateColumns: `repeat(${semanas.length}, 12px)` }}
          >
            {semanas.map((semana, i) => {
              const dataPrimeiroDia = new Date(`${semana[0].data}T00:00:00`);
              const mesAnterior = i > 0 ? new Date(`${semanas[i - 1][0].data}T00:00:00`).getMonth() : null;
              const mostrarLabel = dataPrimeiroDia.getMonth() !== mesAnterior;
              return (
                <span key={semana[0].data} className="relative overflow-visible whitespace-nowrap">
                  {mostrarLabel ? MESES[dataPrimeiroDia.getMonth()] : ""}
                </span>
              );
            })}
          </div>

          <div
            className="grid gap-[3px]"
            style={{ gridTemplateRows: "repeat(7, 12px)", gridAutoFlow: "column", gridAutoColumns: "12px" }}
          >
            {heatmapDados.map((d) => (
              <div
                key={d.data}
                title={`${d.data}: ${d.contagem} questão${d.contagem === 1 ? "" : "es"}`}
                className={`h-3 w-3 rounded-sm ${corPorContagem(d.contagem)}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
        menos
        <span className="h-3 w-3 rounded-sm bg-white/5" />
        <span className="h-3 w-3 rounded-sm bg-gray-400/30" />
        <span className="h-3 w-3 rounded-sm bg-gray-400/60" />
        <span className="h-3 w-3 rounded-sm bg-gray-400" />
        mais
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AtividadeHeatmap.tsx
git commit -m "Add AtividadeHeatmap component"
```

---

### Task 12: Create `CelebracaoModal.tsx`

**Files:**
- Create: `src/components/CelebracaoModal.tsx`

**Interfaces:**
- Consumes: `Celebracao` from `@/lib/gamificacao` (Task 4).
- Produces: `<CelebracaoModal celebracao={Celebracao} onFechar={() => void} />`. Consumed by `SimuladoPlayer.tsx` (Task 17) and `QuizPlayer.tsx` (Task 18).

Port with `accent` → gray; the reference's `animate-celebracao-*` classes are dropped (they're custom keyframes defined only in the concursos project's `globals.css` — this project doesn't have them, and adding new global keyframes isn't part of this plan's scope, so the modal appears without the fade/scale-in animation).

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { Trophy, Flame, Star, CheckCircle2, type LucideIcon } from "lucide-react";
import type { Celebracao } from "@/lib/gamificacao";

function conteudo(celebracao: Celebracao): {
  icone: LucideIcon;
  rotulo: string;
  titulo: string;
  descricao: string;
} {
  switch (celebracao.tipo) {
    case "patente":
      return {
        icone: Trophy,
        rotulo: "Nova patente!",
        titulo: celebracao.patente.titulo,
        descricao: `Você alcançou a patente ${celebracao.patente.numero} de 10. Continue assim!`,
      };
    case "streak":
      return {
        icone: Flame,
        rotulo: "Sequência em chamas!",
        titulo: `${celebracao.dias} dias seguidos`,
        descricao: "Você está mantendo o ritmo de estudo. Não pare agora!",
      };
    case "conquista":
      return {
        icone: Star,
        rotulo: "Nova conquista!",
        titulo: celebracao.titulo,
        descricao: celebracao.descricao,
      };
    case "meta":
      return {
        icone: CheckCircle2,
        rotulo: "Meta batida!",
        titulo: `${celebracao.quantidade} questões hoje`,
        descricao: "Você bateu sua meta diária de estudo. Mandou bem!",
      };
  }
}

export default function CelebracaoModal({
  celebracao,
  onFechar,
}: {
  celebracao: Celebracao;
  onFechar: () => void;
}) {
  const { icone: Icone, rotulo, titulo, descricao } = conteudo(celebracao);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebracao-titulo"
    >
      <div className="w-full max-w-sm rounded-2xl border border-gray-400/30 bg-[#0f1729] p-6 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600/20 text-gray-200">
          <Icone className="h-8 w-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-300">{rotulo}</p>
        <h2 id="celebracao-titulo" className="mt-1 text-2xl font-bold text-white">
          {titulo}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{descricao}</p>
        <button
          onClick={onFechar}
          className="mt-6 w-full rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-500"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CelebracaoModal.tsx
git commit -m "Add CelebracaoModal component"
```

---

### Task 13: Create `FlashcardGrid.tsx`

**Files:**
- Create: `src/components/FlashcardGrid.tsx`

**Interfaces:**
- Consumes: `Flashcard` from `@/lib/types` (Task 3).
- Produces: `<FlashcardGrid grupos={{categoriaId, categoriaNome, cards: Flashcard[]}[]} />`. Consumed by the `/flashcards` route (Task 22).

Port with `accent` → gray.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";

export default function FlashcardGrid({
  grupos,
}: {
  grupos: { categoriaId: string; categoriaNome: string; cards: Flashcard[] }[];
}) {
  const [virados, setVirados] = useState<Record<string, boolean>>({});

  function alternar(id: string) {
    setVirados((v) => ({ ...v, [id]: !v[id] }));
  }

  return (
    <div className="space-y-8">
      {grupos.map((grupo) => (
        <div key={grupo.categoriaId}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {grupo.categoriaNome}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grupo.cards.map((card) => {
              const virado = !!virados[card.id];
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => alternar(card.id)}
                  aria-label={virado ? "Ver pergunta" : "Ver fórmula"}
                  className={`flex min-h-[9rem] flex-col justify-between rounded-xl border p-4 text-left transition ${
                    virado
                      ? "border-gray-400/40 bg-gray-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {card.subtopico}
                    </p>
                    <p className={`text-sm ${virado ? "font-mono text-base text-gray-200" : "text-slate-100"}`}>
                      {virado ? card.verso : card.frente}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">
                    {virado ? "Clique para ver a pergunta" : "Clique para ver a fórmula"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/FlashcardGrid.tsx
git commit -m "Add FlashcardGrid component"
```

---

### Task 14: Create `MetaDiariaCard.tsx` (adapted, no nivel toggle)

**Files:**
- Create: `src/components/MetaDiariaCard.tsx`

**Interfaces:**
- Consumes: `calcularProgressoMetaDiaria`/`calcularDesempenhoPorCategoria`/`recomendarCategoria` from `@/lib/gamificacao` (Task 4), `Categoria` from `@/lib/types`.
- Produces: `<MetaDiariaCard categorias={{categoria: Categoria, questaoIds: string[]}[]} />`. Consumed by the home page (Task 25).

Adapted: no `nivelAtivo` selector, no `dadosFundamental`/`dadosMedio` props — takes `categorias` directly (same shape `desempenho/page.tsx` already builds). Href drops the `/${nivel}` prefix. `warning` → `amber`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import {
  calcularProgressoMetaDiaria,
  calcularDesempenhoPorCategoria,
  recomendarCategoria,
} from "@/lib/gamificacao";
import type { Categoria } from "@/lib/types";

const MINUTOS_POR_QUESTAO = 1.5;

export default function MetaDiariaCard({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const progresso = useMemo(() => calcularProgressoMetaDiaria(registros), [registros]);
  const pct = Math.min(100, Math.round((progresso.atual / progresso.meta) * 100));

  const desempenho = useMemo(
    () => calcularDesempenhoPorCategoria(registros, categorias),
    [registros, categorias]
  );
  const categoriaRecomendada = useMemo(() => recomendarCategoria(desempenho), [desempenho]);

  const questoesRestantes = Math.max(0, progresso.meta - progresso.atual);
  const tempoEstimadoMin = Math.max(1, Math.round(questoesRestantes * MINUTOS_POR_QUESTAO));

  const hrefComecar = categoriaRecomendada ? `/assuntos/${categoriaRecomendada.id}` : "/assuntos";

  return (
    <div id="meta-diaria" className="scroll-mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            progresso.completa ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-slate-400"
          }`}
        >
          {progresso.completa ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta de Hoje</p>
          <p className="text-sm text-white">
            {categoriaRecomendada ? categoriaRecomendada.nome : "Todos os assuntos dominados 🎉"}
          </p>
          <div className="mb-1 mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              {progresso.atual} de {progresso.meta} questões concluídas
            </span>
            <span>Tempo estimado: {tempoEstimadoMin} min</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <Link
        href={hrefComecar}
        className="mt-4 inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:opacity-90"
      >
        {progresso.atual > 0 ? "Continuar estudando" : "Começar agora"}
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/MetaDiariaCard.tsx
git commit -m "Add MetaDiariaCard component (no nivel toggle)"
```

---

### Task 15: Create `RevisaoList.tsx` (adapted, no nivel)

**Files:**
- Create: `src/components/RevisaoList.tsx`

**Interfaces:**
- Consumes: `subscribe`/`getSnapshot`/`getServerSnapshot` from `@/lib/progress`, `EmptyState` (Task 8).
- Produces: `<RevisaoList mapaQuestoes={Record<string, {categoriaId, categoriaNome, subtopico}>} />`. Consumed by the `/revisao` route (Task 20).

- [ ] **Step 1: Write the file**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import EmptyState from "@/components/EmptyState";

interface InfoQuestao {
  categoriaId: string;
  categoriaNome: string;
  subtopico: string;
}

export default function RevisaoList({
  mapaQuestoes,
}: {
  mapaQuestoes: Record<string, InfoQuestao>;
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const itens = useMemo(
    () =>
      Object.entries(registros)
        .filter(([, r]) => r?.respondida && !r.correta)
        .map(([id, r]) => ({ id, info: mapaQuestoes[id], timestamp: r.timestamp }))
        .filter((i): i is { id: string; info: InfoQuestao; timestamp: number } => !!i.info)
        .sort((a, b) => b.timestamp - a.timestamp),
    [registros, mapaQuestoes]
  );

  if (itens.length === 0) {
    return (
      <EmptyState
        icon={RotateCcw}
        titulo="Nenhum erro registrado ainda"
        descricao="As questões que você errar aparecem aqui para você revisar rapidamente."
      />
    );
  }

  return (
    <div className="space-y-3">
      {itens.map(({ id, info }) => (
        <Link
          key={id}
          href={`/assuntos/${info.categoriaId}/${id}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-gray-400"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{info.categoriaNome}</p>
            <p className="truncate text-xs text-slate-400">{info.subtopico}</p>
          </div>
          <span className="shrink-0 text-xs text-slate-400">Revisar →</span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/RevisaoList.tsx
git commit -m "Add RevisaoList component (no nivel)"
```

---

### Task 16: Create `FavoritosList.tsx` (adapted, no nivel)

**Files:**
- Create: `src/components/FavoritosList.tsx`

**Interfaces:**
- Consumes: `subscribe`/`getSnapshot`/`getServerSnapshot`/`alternarFavorito` from `@/lib/favoritos` (Task 5), `EmptyState` (Task 8).
- Produces: `<FavoritosList mapaQuestoes={Record<string, {categoriaId, categoriaNome, subtopico}>} />`. Consumed by the `/favoritos` route (Task 21).

- [ ] **Step 1: Write the file**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot, alternarFavorito } from "@/lib/favoritos";
import EmptyState from "@/components/EmptyState";

interface InfoQuestao {
  categoriaId: string;
  categoriaNome: string;
  subtopico: string;
}

export default function FavoritosList({
  mapaQuestoes,
}: {
  mapaQuestoes: Record<string, InfoQuestao>;
}) {
  const favoritos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const itens = useMemo(
    () =>
      Object.keys(favoritos)
        .map((id) => ({ id, info: mapaQuestoes[id] }))
        .filter((i): i is { id: string; info: InfoQuestao } => !!i.info),
    [favoritos, mapaQuestoes]
  );

  if (itens.length === 0) {
    return (
      <EmptyState
        icon={Star}
        titulo="Nenhuma questão favoritada"
        descricao="Clique na estrela ao responder uma questão para salvá-la aqui e achar rápido depois."
      />
    );
  }

  return (
    <div className="space-y-3">
      {itens.map(({ id, info }) => (
        <div
          key={id}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{info.categoriaNome}</p>
            <p className="truncate text-xs text-slate-400">{info.subtopico}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/assuntos/${info.categoriaId}/${id}`}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
            >
              Abrir
            </Link>
            <button
              type="button"
              onClick={() => alternarFavorito(id)}
              aria-label="Remover dos favoritos"
              className="text-amber-400"
            >
              <Star className="h-4 w-4 fill-amber-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/FavoritosList.tsx
git commit -m "Add FavoritosList component (no nivel)"
```

---

### Task 17: Create `SimuladoPlayer.tsx` (adapted, no nivel arg)

**Files:**
- Create: `src/components/SimuladoPlayer.tsx`

**Interfaces:**
- Consumes: `Alternativa`/`Questao` from `@/lib/types`, `DificuldadeBadge` (existing), `CelebracaoModal` (Task 12), `registrarResposta`/`getSnapshot` from `@/lib/progress`, `detectarCelebracoes`/`Celebracao` from `@/lib/gamificacao` (Task 4).
- Produces: `<SimuladoPlayer questoes={(Questao & {categoriaNome: string})[]} />`. Consumed by the `/simulados` route (Task 19).

Adapted: `registrarResposta(questao.id, correta, selecionada)` — the reference passes `questao.nivel` as a second argument, which ENEM's `registrarResposta` doesn't accept (it's `(questaoId, correta, alternativaEscolhida)`). `accent` → `gray-600`/`emerald` for the finished-screen icon.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import type { Alternativa, Questao } from "@/lib/types";
import DificuldadeBadge from "@/components/DificuldadeBadge";
import CelebracaoModal from "@/components/CelebracaoModal";
import { registrarResposta, getSnapshot } from "@/lib/progress";
import { detectarCelebracoes, type Celebracao } from "@/lib/gamificacao";

interface QuestaoComCategoria extends Questao {
  categoriaNome: string;
}

export default function SimuladoPlayer({ questoes }: { questoes: QuestaoComCategoria[] }) {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<Alternativa["letra"] | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [celebracoes, setCelebracoes] = useState<Celebracao[]>([]);

  const questao = questoes[indice];
  const ultima = indice === questoes.length - 1;

  function escolher(letra: Alternativa["letra"]) {
    if (respondida) return;
    setSelecionada(letra);
  }

  function responder() {
    if (!selecionada || respondida) return;
    setRespondida(true);
    const correta = selecionada === questao.correta;
    if (correta) setAcertos((a) => a + 1);
    const antes = getSnapshot();
    registrarResposta(questao.id, correta, selecionada);
    const depois = getSnapshot();
    const novas = detectarCelebracoes(antes, depois);
    if (novas.length > 0) setCelebracoes(novas);
  }

  function proxima() {
    if (ultima) {
      setFinalizado(true);
      return;
    }
    setIndice((i) => i + 1);
    setSelecionada(null);
    setRespondida(false);
  }

  function estiloAlternativa(letra: Alternativa["letra"]) {
    if (!respondida) {
      return selecionada === letra
        ? "border-gray-400 bg-gray-400/10"
        : "border-white/10 bg-white/[0.02] hover:bg-white/5";
    }
    if (letra === questao.correta) return "border-emerald-500/50 bg-emerald-500/15";
    if (letra === selecionada) return "border-rose-500/50 bg-rose-500/15";
    return "border-white/10 bg-white/[0.02] opacity-60";
  }

  if (finalizado) {
    const pct = Math.round((acertos / questoes.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mb-1 text-2xl font-bold text-white">Simulado concluído!</h1>
        <p className="mb-6 text-sm text-slate-400">
          Você acertou {acertos} de {questoes.length} questões ({pct}%), cobrindo {questoes.length} assuntos
          diferentes.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-500"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer com novas questões
        </button>
      </div>
    );
  }

  const acertou = respondida && selecionada === questao.correta;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Simulado › {questao.categoriaNome} › {questao.subtopico}
      </p>
      <div className="mb-6 flex items-center justify-between">
        <DificuldadeBadge dificuldade={questao.dificuldade} />
        <span className="text-xs text-slate-400">
          Questão {indice + 1} de {questoes.length} · {acertos} acerto{acertos === 1 ? "" : "s"} até agora
        </span>
      </div>

      <p className="mb-4 text-lg leading-relaxed text-slate-100">{questao.enunciado}</p>

      <div className="mb-6 flex flex-col gap-3">
        {questao.alternativas.map((alt) => (
          <button
            key={alt.letra}
            onClick={() => escolher(alt.letra)}
            disabled={respondida}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${estiloAlternativa(alt.letra)}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold">
              {alt.letra}
            </span>
            <span className="text-sm text-slate-100">{alt.texto}</span>
          </button>
        ))}
      </div>

      {!respondida ? (
        <button
          onClick={responder}
          disabled={!selecionada}
          className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-500"
        >
          Responder
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              acertou
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
          >
            <p className="font-semibold">{acertou ? "Você acertou!" : "Você errou."}</p>
            {!acertou && (
              <p className="mt-1 text-slate-300">
                Alternativa correta: <strong>{questao.correta}</strong>
              </p>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Resolução comentada
            </p>
            <p className="text-sm text-slate-200">{questao.explicacao}</p>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={proxima}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
            >
              {ultima ? "Ver resultado" : "Próxima questão →"}
            </button>
          </div>
        </div>
      )}

      {celebracoes[0] && (
        <CelebracaoModal
          celebracao={celebracoes[0]}
          onFechar={() => setCelebracoes((c) => c.slice(1))}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SimuladoPlayer.tsx
git commit -m "Add SimuladoPlayer component (no nivel arg)"
```

---

### Task 18: Extend `QuizPlayer.tsx` with favorite star and celebration modal

**Files:**
- Modify: `src/components/QuizPlayer.tsx` (full-file rewrite — small, scattered changes)

**Interfaces:**
- Consumes: `alternarFavorito`/`subscribe`/`getSnapshot`/`getServerSnapshot` from `@/lib/favoritos` (Task 5), `detectarCelebracoes`/`Celebracao` from `@/lib/gamificacao` (Task 4), `CelebracaoModal` (Task 12).
- Produces: same public interface as before (`categoriaId`, `categoriaNome`, `questao`, `prevId`, `nextId`, `posicao`, `total` props) — unchanged, so no caller needs updating.

Adds a favorite-star toggle next to `DificuldadeBadge` and wires up celebration detection around `registrarResposta`, same pattern as `SimuladoPlayer.tsx` (Task 17). Everything else — including the three-way fonte badge added earlier this session — is preserved verbatim.

- [ ] **Step 1: Overwrite the file**

```tsx
"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { Alternativa, Questao } from "@/lib/types";
import DificuldadeBadge from "@/components/DificuldadeBadge";
import SolidoDiagram from "@/components/SolidoDiagram";
import GraficoDiagram from "@/components/GraficoDiagram";
import CelebracaoModal from "@/components/CelebracaoModal";
import { registrarResposta, getSnapshot } from "@/lib/progress";
import { detectarCelebracoes, type Celebracao } from "@/lib/gamificacao";
import {
  alternarFavorito,
  subscribe as subscribeFavoritos,
  getSnapshot as getFavoritosSnapshot,
  getServerSnapshot as getFavoritosServerSnapshot,
} from "@/lib/favoritos";

export default function QuizPlayer({
  questao,
  categoriaId,
  categoriaNome,
  prevId,
  nextId,
  posicao,
  total,
}: {
  questao: Questao;
  categoriaId: string;
  categoriaNome: string;
  prevId?: string;
  nextId?: string;
  posicao: number;
  total: number;
}) {
  const [selecionada, setSelecionada] = useState<Alternativa["letra"] | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [celebracoes, setCelebracoes] = useState<Celebracao[]>([]);
  const favoritos = useSyncExternalStore(subscribeFavoritos, getFavoritosSnapshot, getFavoritosServerSnapshot);
  const favoritada = !!favoritos[questao.id];

  function escolher(letra: Alternativa["letra"]) {
    if (respondida) return;
    setSelecionada(letra);
  }

  function responder() {
    if (!selecionada || respondida) return;
    setRespondida(true);
    const antes = getSnapshot();
    registrarResposta(questao.id, selecionada === questao.correta, selecionada);
    const depois = getSnapshot();
    const novas = detectarCelebracoes(antes, depois);
    if (novas.length > 0) setCelebracoes(novas);
  }

  const acertou = respondida && selecionada === questao.correta;

  function estiloAlternativa(letra: Alternativa["letra"]) {
    if (!respondida) {
      return selecionada === letra
        ? "border-gray-400 bg-gray-400/10"
        : "border-white/10 bg-white/[0.02] hover:bg-white/5";
    }
    if (letra === questao.correta) return "border-emerald-500/50 bg-emerald-500/15";
    if (letra === selecionada) return "border-rose-500/50 bg-rose-500/15";
    return "border-white/10 bg-white/[0.02] opacity-60";
  }

  const comentarioErro = selecionada && questao.distratores?.[selecionada];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {categoriaNome} › {questao.subtopico}
      </p>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DificuldadeBadge dificuldade={questao.dificuldade} />
          <button
            type="button"
            onClick={() => alternarFavorito(questao.id)}
            aria-label={favoritada ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            aria-pressed={favoritada}
            className="text-slate-400 transition hover:text-amber-400"
          >
            <Star className={`h-4 w-4 ${favoritada ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>
        <span className="text-xs text-slate-400">
          Questão {posicao} de {total}
          {questao.fonte.tipo === "enem" && questao.fonte.ano
            ? ` · ENEM ${questao.fonte.ano}`
            : questao.fonte.tipo === "banco"
              ? ` · Banco${questao.fonte.banca ? ` (${questao.fonte.banca})` : ""}`
              : " · Inédita"}
        </span>
      </div>

      <p className="mb-4 text-lg leading-relaxed text-slate-100">{questao.enunciado}</p>

      {questao.figura && (
        <figure className="mb-6 overflow-hidden rounded-lg border border-white/10 bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={questao.figura.src} alt={questao.figura.alt} className="mx-auto h-auto max-w-full" />
          {questao.figura.legenda && (
            <figcaption className="mt-2 text-center text-xs text-slate-500">{questao.figura.legenda}</figcaption>
          )}
        </figure>
      )}

      {questao.diagrama && (
        <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
          {"categorias" in questao.diagrama ? (
            <GraficoDiagram diagrama={questao.diagrama} />
          ) : (
            <SolidoDiagram diagrama={questao.diagrama} />
          )}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {questao.alternativas.map((alt) => (
          <button
            key={alt.letra}
            onClick={() => escolher(alt.letra)}
            disabled={respondida}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${estiloAlternativa(alt.letra)}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold">
              {alt.letra}
            </span>
            {alt.imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={alt.imagem} alt={`Alternativa ${alt.letra}`} className="h-auto max-w-full rounded bg-white p-1" />
            ) : (
              <span className="text-sm text-slate-100">{alt.texto}</span>
            )}
          </button>
        ))}
      </div>

      {!respondida ? (
        <button
          onClick={responder}
          disabled={!selecionada}
          className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-500"
        >
          Responder
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              acertou
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
          >
            <p className="font-semibold">{acertou ? "Você acertou!" : "Você errou."}</p>
            {!acertou && (
              <p className="mt-1 text-slate-300">
                Alternativa correta: <strong>{questao.correta}</strong>
              </p>
            )}
          </div>

          {!acertou && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Por que você errou
              </p>
              <p className="text-sm text-slate-200">
                {comentarioErro ?? questao.explicacao}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Resolução comentada
            </p>
            <p className="text-sm text-slate-200">{questao.explicacao}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href={prevId ? `/assuntos/${categoriaId}/${prevId}` : `/assuntos/${categoriaId}`}
              className="text-sm text-slate-400 hover:text-white"
            >
              ← Anterior
            </Link>
            <Link
              href={nextId ? `/assuntos/${categoriaId}/${nextId}` : `/assuntos/${categoriaId}`}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
            >
              Próxima questão →
            </Link>
          </div>
        </div>
      )}

      {celebracoes[0] && (
        <CelebracaoModal
          celebracao={celebracoes[0]}
          onFechar={() => setCelebracoes((c) => c.slice(1))}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/QuizPlayer.tsx
git commit -m "Add favorite star and celebration modal to QuizPlayer"
```

---

### Task 19: Create `/simulados` route

**Files:**
- Create: `src/app/simulados/page.tsx`

**Interfaces:**
- Consumes: `selecionarSimulado` from `@/lib/simulado` (Task 6), `getCategoria` from `@/data/categorias`, `SimuladoPlayer` (Task 17).

Mirrors the reference's `export const dynamic = "force-dynamic"` (so the random simulado isn't cached at build time) and its `key={simuladoId}` trick (forces `SimuladoPlayer` to remount with fresh state after "Refazer com novas questões" calls `router.refresh()`).

- [ ] **Step 1: Write the file**

```tsx
import { selecionarSimulado } from "@/lib/simulado";
import { getCategoria } from "@/data/categorias";
import SimuladoPlayer from "@/components/SimuladoPlayer";

export const dynamic = "force-dynamic";

export default function SimuladosPage() {
  const questoes = selecionarSimulado().map((q) => ({
    ...q,
    categoriaNome: getCategoria(q.categoriaId)?.nome ?? q.categoriaId,
  }));
  const simuladoId = questoes.map((q) => q.id).join("-");

  return <SimuladoPlayer key={simuladoId} questoes={questoes} />;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/simulados/page.tsx
git commit -m "Add /simulados route"
```

---

### Task 20: Create `/revisao` route

**Files:**
- Create: `src/app/revisao/page.tsx`

**Interfaces:**
- Consumes: `todasQuestoes` from `@/lib/questions`, `categorias` from `@/data/categorias`, `RevisaoList` (Task 15).

- [ ] **Step 1: Write the file**

```tsx
import { todasQuestoes } from "@/lib/questions";
import { categorias } from "@/data/categorias";
import RevisaoList from "@/components/RevisaoList";

export default function RevisaoPage() {
  const nomeCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
  const mapaQuestoes = Object.fromEntries(
    todasQuestoes.map((q) => [
      q.id,
      {
        categoriaId: q.categoriaId,
        categoriaNome: nomeCategoria.get(q.categoriaId) ?? q.categoriaId,
        subtopico: q.subtopico,
      },
    ])
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Revisão</h1>
      <RevisaoList mapaQuestoes={mapaQuestoes} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/revisao/page.tsx
git commit -m "Add /revisao route"
```

---

### Task 21: Create `/favoritos` route

**Files:**
- Create: `src/app/favoritos/page.tsx`

**Interfaces:**
- Consumes: `todasQuestoes` from `@/lib/questions`, `categorias` from `@/data/categorias`, `FavoritosList` (Task 16).

- [ ] **Step 1: Write the file**

```tsx
import { todasQuestoes } from "@/lib/questions";
import { categorias } from "@/data/categorias";
import FavoritosList from "@/components/FavoritosList";

export default function FavoritosPage() {
  const nomeCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
  const mapaQuestoes = Object.fromEntries(
    todasQuestoes.map((q) => [
      q.id,
      {
        categoriaId: q.categoriaId,
        categoriaNome: nomeCategoria.get(q.categoriaId) ?? q.categoriaId,
        subtopico: q.subtopico,
      },
    ])
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Favoritos</h1>
      <FavoritosList mapaQuestoes={mapaQuestoes} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/favoritos/page.tsx
git commit -m "Add /favoritos route"
```

---

### Task 22: Create `/flashcards` route

**Files:**
- Create: `src/app/flashcards/page.tsx`

**Interfaces:**
- Consumes: `categorias` from `@/data/categorias`, `flashcards.json` (Task 7), `Flashcard` type (Task 3), `FlashcardGrid` (Task 13).

- [ ] **Step 1: Write the file**

```tsx
import { categorias } from "@/data/categorias";
import flashcards from "@/data/flashcards.json";
import FlashcardGrid from "@/components/FlashcardGrid";
import type { Flashcard } from "@/lib/types";

export default function FlashcardsPage() {
  const porCategoria = new Map<string, Flashcard[]>();
  for (const card of flashcards as Flashcard[]) {
    const lista = porCategoria.get(card.categoriaId);
    if (lista) lista.push(card);
    else porCategoria.set(card.categoriaId, [card]);
  }

  const grupos = categorias
    .filter((c) => porCategoria.has(c.id))
    .map((c) => ({
      categoriaId: c.id,
      categoriaNome: c.nome,
      cards: porCategoria.get(c.id)!,
    }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Flashcards</h1>
      <FlashcardGrid grupos={grupos} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/flashcards/page.tsx
git commit -m "Add /flashcards route"
```

---

### Task 23: Add new links to `Navbar.tsx`

**Files:**
- Modify: `src/components/Navbar.tsx:6-11` (the `links` array)

**Interfaces:** none (presentational only).

- [ ] **Step 1: Update the links array**

In `src/components/Navbar.tsx`, replace:

```tsx
const links = [
  { href: "/", label: "Início" },
  { href: "/assuntos", label: "Assuntos" },
  { href: "/dificuldade", label: "Dificuldade" },
  { href: "/desempenho", label: "Meu Desempenho" },
];
```

with:

```tsx
const links = [
  { href: "/", label: "Início" },
  { href: "/assuntos", label: "Assuntos" },
  { href: "/dificuldade", label: "Dificuldade" },
  { href: "/simulados", label: "Simulados" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/revisao", label: "Revisão" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/desempenho", label: "Meu Desempenho" },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "Add Simulados, Flashcards, Revisão, Favoritos links to navbar"
```

---

### Task 24: Add gamification to `DesempenhoView.tsx`

**Files:**
- Modify: `src/components/DesempenhoView.tsx` (full-file rewrite)

**Interfaces:**
- Consumes: `calcularConquistas`/`contarDominadas` from `@/lib/gamificacao` (Task 4), `PatenteCard` (Task 9), `AtividadeHeatmap` (Task 11), `ConquistasGrid` (Task 10).
- Produces: same public interface as before (`nome`, `questaoIdsGlobal`, `categorias` props) — unchanged, so `src/app/desempenho/page.tsx` needs no changes.

- [ ] **Step 1: Overwrite the file**

```tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularConquistas, contarDominadas } from "@/lib/gamificacao";
import type { Categoria } from "@/lib/types";
import ResultShareCard from "@/components/ResultShareCard";
import PatenteCard from "@/components/PatenteCard";
import AtividadeHeatmap from "@/components/AtividadeHeatmap";
import ConquistasGrid from "@/components/ConquistasGrid";

export default function DesempenhoView({
  nome,
  questaoIdsGlobal,
  categorias,
}: {
  nome: string | null;
  questaoIdsGlobal: string[];
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stats = useMemo(
    () => calcularEstatisticas(registros, questaoIdsGlobal),
    [registros, questaoIdsGlobal]
  );

  const desempenhoPorCategoria = useMemo(
    () =>
      categorias.map(({ categoria, questaoIds }) => ({
        categoria,
        stats: calcularEstatisticas(registros, questaoIds),
      })),
    [registros, categorias]
  );

  const porCategoria = useMemo(
    () =>
      desempenhoPorCategoria
        .filter((c) => c.stats.respondidas > 0)
        .sort((a, b) => b.stats.respondidas - a.stats.respondidas),
    [desempenhoPorCategoria]
  );

  const dominadas = useMemo(() => contarDominadas(desempenhoPorCategoria), [desempenhoPorCategoria]);
  const conquistas = useMemo(
    () => calcularConquistas(registros, dominadas, categorias.length),
    [registros, dominadas, categorias.length]
  );

  return (
    <div className="space-y-8">
      <PatenteCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Resolvidas</p>
          <p className="text-2xl font-bold text-white">
            {stats.respondidas} / {questaoIdsGlobal.length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Acertos</p>
          <p className="text-2xl font-bold text-white">
            {stats.acertoPct !== null ? `${stats.acertoPct}%` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Categorias praticadas</p>
          <p className="text-2xl font-bold text-white">
            {porCategoria.length} / {categorias.length}
          </p>
        </div>
      </div>

      <ResultShareCard nome={nome ?? "Visitante"} stats={stats} />

      <AtividadeHeatmap />

      {porCategoria.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Por assunto</h2>
          <div className="space-y-2">
            {porCategoria.map(({ categoria, stats: s }) => (
              <div
                key={categoria.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm"
              >
                <span className="text-slate-200">{categoria.nome}</span>
                <span className="text-slate-400">
                  {s.respondidas} respondidas ·{" "}
                  {s.acertoPct !== null ? `${s.acertoPct}%` : "—"} de acerto
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Conquistas</h2>
        <ConquistasGrid conquistas={conquistas} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DesempenhoView.tsx
git commit -m "Add PatenteCard, AtividadeHeatmap, ConquistasGrid to DesempenhoView"
```

---

### Task 25: Add `MetaDiariaCard` to the home page

**Files:**
- Modify: `src/app/page.tsx` (full-file rewrite)

**Interfaces:**
- Consumes: `MetaDiariaCard` (Task 14), `questoesPorCategoria` from `@/lib/questions` (already exported).
- Produces: same public interface as before (no props — it's the `/` page) — unchanged.

- [ ] **Step 1: Overwrite the file**

```tsx
import Link from "next/link";
import { categorias } from "@/data/categorias";
import { todasQuestoes, questoesPorCategoria, contagemReaisPorAno } from "@/lib/questions";
import HomeStats from "@/components/HomeStats";
import MetaDiariaCard from "@/components/MetaDiariaCard";

export default function Home() {
  const anos = Object.keys(contagemReaisPorAno()).map(Number).sort();
  const totalReais = todasQuestoes.filter((q) => q.fonte.tipo === "enem").length;
  const categoriasComQuestoes = categorias.map((c) => ({
    categoria: c,
    questaoIds: questoesPorCategoria(c.id).map((q) => q.id),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-900 p-8">
        <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
          {todasQuestoes.length}+ questões · {categorias.length} categorias oficiais do ENEM
        </p>
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Prof. Thomaz — Matemática ENEM</h1>
        <p className="mb-6 max-w-2xl text-gray-300">
          Pratique com questões organizadas por assunto e nível de dificuldade,
          responda e receba feedback imediato: certo ou errado, com a explicação
          de cada erro e a alternativa correta.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/assuntos" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Explorar por Assunto →
          </Link>
          <Link href="/dificuldade" className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
            Explorar por Dificuldade
          </Link>
          <Link href="/aleatoria" className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
            Questão Aleatória
          </Link>
        </div>
      </section>

      <div className="mb-10">
        <MetaDiariaCard categorias={categoriasComQuestoes} />
      </div>

      <HomeStats questaoIds={todasQuestoes.map((q) => q.id)} />

      <section className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-1 text-sm font-semibold text-white">Origem das questões</p>
        <p className="text-sm text-slate-400">
          {totalReais > 0
            ? `${totalReais} questões reais de provas do ENEM (${anos.join(", ")}) e ${todasQuestoes.length - totalReais} questões inéditas geradas para completar o banco por assunto e dificuldade.`
            : `Banco atualmente composto por ${todasQuestoes.length} questões inéditas (estilo ENEM), geradas para cobrir todos os assuntos e níveis de dificuldade. Questões reais de provas passadas serão adicionadas e claramente identificadas com o ano de origem assim que verificadas.`}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-white">Assuntos em destaque</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/assuntos/${c.id}`}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.06]"
            >
              {c.nome} <span className="text-xs text-slate-500">({c.pesoProva})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "Add MetaDiariaCard to the home page"
```

---

### Task 26: Final validation pass

**Files:** none created/modified — verification only.

**Interfaces:** none.

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Existing question-bank validator still passes**

Run: `node scripts/validate.mjs`
Expected: `Total de erros encontrados: 0` (this task touches no question data, so the count of inédita questions verified should be unchanged from before this plan).

- [ ] **Step 3: Manual browser walkthrough**

Follow the same temporary/reversible technique already used earlier in this project's history for verifying auth-gated pages: in `src/proxy.ts`, temporarily change the gate condition `if (!user && !isPublicPath(pathname))` to `if (false && !user && !isPublicPath(pathname))`, start the dev server (`npm run dev -- -p 3311`, poll `http://localhost:3311` until it responds), then check each of the following with `curl -s <url> -o <file>` + grep, or an actual browser if available:

- `/desempenho` — answer one question first (via `/assuntos/numeros/<some-id>`) so `PatenteCard`/`AtividadeHeatmap`/`ConquistasGrid` have non-empty data to render; confirm the page contains "Patente 1", "Dias de Estudo", "Conquistas", and "Primeira questão".
- `/simulados` — confirm the page renders a question with "Simulado ›" in the breadcrumb and 20 categories worth of variety across a couple of reloads (categories shouldn't repeat within one load).
- `/flashcards` — confirm it renders category headers and cards, and that no card belongs to `argumentos-silogismos`, `diagramas-logicos`, `tabelas-verdade`, or `verdades-e-mentiras`.
- `/favoritos` — before answering anything, confirm the empty state ("Nenhuma questão favoritada") renders; then favorite a question via the star button on a `/assuntos/.../...` page and confirm it now appears here.
- `/revisao` — confirm the empty state renders before any wrong answers; answer a question incorrectly and confirm it appears here.
- A `/assuntos/<categoria>/<id>` page — confirm the star button toggles (icon fills amber on click) and that answering a question that crosses a celebration threshold (e.g., the very first question ever answered, which triggers "Primeira questão") pops the `CelebracaoModal`.

Then revert `src/proxy.ts` back to `if (!user && !isPublicPath(pathname))` and confirm `git diff -- src/proxy.ts` is empty before stopping the dev server (`lsof -ti:3311 -sTCP:LISTEN | xargs -r kill` or stop the background task by its id).

- [ ] **Step 4: Confirm working tree is clean apart from this plan's commits**

Run: `git status --porcelain`
Expected: empty (everything from this plan already committed task-by-task; the `proxy.ts` bypass from Step 3 was reverted).
