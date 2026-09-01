# Deduplicação e variedade estrutural do banco de questões — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover as duplicatas exatas de `banco.json` e reescrever o gerador de questões inéditas para que nenhuma estrutura de questão apareça mais que 3 vezes, fechando cada categoria em ~50 questões no total.

**Architecture:** Duas frentes independentes. (A) Um script descartável normaliza e agrupa os enunciados de `banco.json`, mantém 1 questão por grupo idêntico e remove cópias que também existam em `real.json`. (B) O pipeline de geração (`helpers.mjs` → `templates.mjs` → `generate.mjs`) ganha um PRNG semeado (saída determinística), um teto de 3 questões por molde por categoria, contagem de "questões reais + banco" para decidir quantas inéditas gerar, um validador que cobre todos os JSONs, e ~92 moldes novos adicionados uma categoria por commit.

**Tech Stack:** Node.js ESM scripts (`.mjs`, sem dependências externas), Next.js 15 App Router + TypeScript (só leitura dos JSONs via import), Tailwind.

**Spec:** `docs/superpowers/specs/2026-08-28-dedupe-e-variedade-questoes-design.md`

## Global Constraints

- **Não mexer em `real.json`** (ENEM oficial) exceto pelo efeito indireto da Fase 1 (a cópia `banco-100` sai de `banco.json`, `enem-2010-176` permanece intacta em `real.json`).
- **Não reescrever questões de `banco.json` que não sejam duplicata exata** — o critério é enunciado **normalizado idêntico**, nunca "parecido".
- **Não mudar** `src/lib/types.ts` nem o formato dos JSONs. Sem backend, sem persistência.
- **Formato de escrita dos JSONs:** `JSON.stringify(dados, null, 2)`. `banco.json` termina com `\n` (preservar); os arquivos por categoria (`numeros.json` etc.) são escritos **sem** newline final por `generate.mjs` (manter).
- **PRNG:** `SEED = 20260828`, algoritmo mulberry32. Toda aleatoriedade da geração passa a consumir esse gerador. Regenerar sem mudar molde nenhum deve produzir os arquivos **byte a byte idênticos**.
- **Teto:** nenhuma estrutura (molde) gera mais que **3 questões por categoria**.
- **Meta:** `META_TOTAL = 50`. `realLike[cat]` = questões de `real.json` + questões de `banco.json` (já deduplicado) com aquela `categoriaId`. `need = max(0, 50 − realLike[cat])`. Categoria com `need == 0` grava arquivo com `[]`.
- **Cada molde novo:** função `(dificuldade) => makeQuestao({...})`; resposta certa **calculada em código**; distratores são erros clássicos **calculados** (não aleatórios); enunciado em pt-BR estilo ENEM; `subtopico` **exatamente** igual a um item de `Categoria.subtopicos` em `src/data/categorias.ts` (lista completa na Task 7); registrado no objeto `TEMPLATES`; **resolvido à mão** e conferido contra a saída antes do commit da fase.
- **Portão de cada fase:** `node scripts/generate.mjs && node scripts/validate-all.mjs && npm run build` — todos verdes — e um commit.
- Categorias que já fecham ≥ 50 com ENEM+banco (**Números, Porcentagem, Razão e Proporção, Equações e Sistemas, Exponenciais e Logaritmos, Geometria Plana**) **não recebem moldes novos** e passam a gerar 0 inéditas; os moldes atuais delas permanecem no arquivo, só não são exercitados.
- Matrizes, Conjuntos e Geometria Analítica **podem fechar abaixo de 50** se o catálogo de estruturas distintas se esgotar — aceito; registrar o número real no `_resumo.json` e no commit.

## Estado atual (verificado)

- `scripts/helpers.mjs` — usa `Math.random()` em `randInt`, `randFloat`, `pick`, `shuffle`. `nextId(categoriaId)` = `${categoriaId}-ined-${counter}` com `counter` global incremental. `buildAlternativas` usa `shuffle` internamente. `makeQuestao` monta a questão. Exporta `DIFICULDADES = ["facil","medio","dificil"]` e `dedupeByEnunciado`.
- `scripts/templates.mjs` — 40 funções-molde + objeto `TEMPLATES` mapeando `categoriaId → [fn, ...]` no fim do arquivo. Importa `randInt, randFloat, pick, brl, pct, makeQuestao, gcd` de `helpers.mjs`. Tem helpers locais `mmc`, `toSci`, `fmtSci`, `fatorial`, `combinacao`, constantes `TRIPLAS_PITAGORICAS`, `ANGULOS`, `CONTEXTOS_GRAFICO`.
- `scripts/generate.mjs` — lê só `real.json` para `realCount`; alvo `max(10, 50 − realCount)`; cicla `fnIndex`/`difIndex` sem teto por molde; `dedupeByEnunciado` por categoria; grava `${cat}.json` e `_resumo.json`.
- `scripts/validate.mjs` — só os 20 arquivos por categoria; checa 5 alternativas únicas, gabarito presente, letras `A..E` em ordem. Não checa `real.json`/`banco.json`, ids globais, nem enunciado repetido.
- `scripts/categorias.mjs` — array `CATEGORIAS` com os 20 ids, na ordem canônica.
- `src/data/questions/banco.json` — 603 questões, ids `banco-<n>`, **299 têm 4 alternativas** (não 5). Termina com `\n`.
- `src/data/questions/real.json` — 269 questões, ids `enem-<ano>-<n>`.
- `src/lib/questions.ts` — importa os 20 JSONs por categoria + `real.json` + `banco.json` em `todasQuestoes`. Um arquivo com `[]` é import válido.
- `src/components/Sidebar.tsx` — função `Logo()` tem o texto literal `1500+ questões` (linhas ~62-64, dentro de um `<span>` após `Matemática ENEM` e um `<br />`).

---

## File Structure

| Arquivo | Papel | Fase |
|---|---|---|
| `scripts/dedupe-banco.mjs` | **Criar.** Script descartável: normaliza enunciados de `banco.json`, remove duplicatas exatas (mantém menor id) e cópias presentes em `real.json`. Roda uma vez. | 1 |
| `scripts/helpers.mjs` | **Modificar.** Adicionar mulberry32 semeado; `randInt/randFloat/pick/shuffle` passam a consumir o PRNG; exportar `resetRng()` para os testes. | 1 |
| `scripts/generate.mjs` | **Reescrever o laço.** Contar `realLike` (real + banco); `need = max(0, 50 − realLike)`; teto de 3 por molde; categoria cheia grava `[]`; `resetRng()` no início; warning quando fecha < 50. | 1 |
| `scripts/validate-all.mjs` | **Criar.** Valida os 20 JSONs por categoria + `real.json` + `banco.json`: alternativas (5 únicas p/ inéditas e real; 4-ou-5 p/ banco), gabarito, letras em ordem, **ids únicos globais**, **enunciado normalizado único global**, teto de 3 por estrutura nas inéditas, `subtopico` válido. `exit 1` em qualquer erro. | 1 |
| `scripts/dedupe-check.test.mjs` | **Criar.** Testes `node --test` para `norm()`, agrupamento e regra de manutenção do menor id. | 1 |
| `scripts/rng.test.mjs` | **Criar.** Testes `node --test`: mulberry32 determinístico; `resetRng()` reproduz a sequência; `generate.mjs` produz saída idêntica em duas execuções. | 1 |
| `src/components/Sidebar.tsx` | **Modificar.** Trocar `1500+ questões` por contagem honesta derivada de `todasQuestoes.length` (arredondada para baixo à centena, sufixo `+`). | 1 |
| `scripts/templates.mjs` | **Modificar (Fases 2-9).** Adicionar ~92 moldes novos; registrar cada um em `TEMPLATES`. | 2-9 |
| `docs/verificacao-moldes/<categoria>.md` | **Criar por fase (2-9).** Um exemplo resolvido à mão por molde novo, com a saída do gerador colada ao lado, para o portão "conta conferida". | 2-9 |
| `package.json` | **Modificar (Task 1).** Adicionar scripts `"validate-all"` e `"regen"` (`generate && validate-all`). | 1 |

---

## FASE 1 — Limpeza e infraestrutura (sem moldes novos)

### Task 1: Dedupe de `banco.json`

**Files:**
- Create: `scripts/dedupe-banco.mjs`
- Create: `scripts/dedupe-check.test.mjs`
- Modify: `src/data/questions/banco.json` (efeito da execução — ~59 questões removidas)
- Modify: `package.json` (adicionar scripts)

**Interfaces:**
- Produces: `scripts/dedupe-banco.mjs` exporta `norm(s: string): string` e `planejarRemocao(banco: Questao[], real: Questao[]): { remover: Set<string>, manter: Map<string,string> }` para os testes; ao rodar como `main` (via `import.meta.url`), reescreve `banco.json`.
- Consumes: nada.

- [ ] **Step 1: Escrever o teste que falha**

Criar `scripts/dedupe-check.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { norm, planejarRemocao } from "./dedupe-banco.mjs";

test("norm colapsa espaço, acento, caixa e marcador ordinal", () => {
  assert.equal(norm("  O  2º  DIA  é  Ótimo "), norm("o 2o dia e otimo"));
});

test("mantém a questão de menor id em grupo idêntico do banco", () => {
  const banco = [
    { id: "banco-50", enunciado: "Qual o valor de x?", categoriaId: "numeros" },
    { id: "banco-12", enunciado: "Qual o  valor de x?", categoriaId: "numeros" },
    { id: "banco-99", enunciado: "QUAL O VALOR DE X?", categoriaId: "numeros" },
    { id: "banco-77", enunciado: "Outra pergunta.", categoriaId: "numeros" },
  ];
  const { remover, manter } = planejarRemocao(banco, []);
  assert.deepEqual([...remover].sort(), ["banco-50", "banco-99"]);
  assert.equal(manter.get(norm("Qual o valor de x?")), "banco-12");
  assert.ok(!remover.has("banco-77"));
});

test("remove do banco toda questão cujo enunciado também existe em real.json", () => {
  const banco = [
    { id: "banco-100", enunciado: "Enunciado repetido do ENEM.", categoriaId: "numeros" },
    { id: "banco-101", enunciado: "Enunciado só do banco.", categoriaId: "numeros" },
  ];
  const real = [{ id: "enem-2010-176", enunciado: "Enunciado repetido do  ENEM.", categoriaId: "numeros" }];
  const { remover } = planejarRemocao(banco, real);
  assert.deepEqual([...remover], ["banco-100"]);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `node --test scripts/dedupe-check.test.mjs`
Expected: FAIL — `Cannot find module './dedupe-banco.mjs'` (ou "does not provide an export named 'norm'").

- [ ] **Step 3: Implementar `scripts/dedupe-banco.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "..", "src", "data", "questions");
const BANCO_PATH = path.join(DIR, "banco.json");
const REAL_PATH = path.join(DIR, "real.json");

export function norm(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[º°ª]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const idNum = (id) => Number(String(id).replace(/\D/g, "")) || 0;

export function planejarRemocao(banco, real) {
  const realEnunciados = new Set(real.map((q) => norm(q.enunciado)));
  const grupos = new Map(); // enunciadoNorm -> Questao[]
  for (const q of banco) {
    const k = norm(q.enunciado);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(q);
  }
  const remover = new Set();
  const manter = new Map(); // enunciadoNorm -> id mantido
  for (const [k, qs] of grupos) {
    if (realEnunciados.has(k)) {
      for (const q of qs) remover.add(q.id); // cópia do ENEM oficial: remove todas do banco
      continue;
    }
    const ordenadas = [...qs].sort((a, b) => idNum(a.id) - idNum(b.id));
    manter.set(k, ordenadas[0].id);
    for (const q of ordenadas.slice(1)) remover.add(q.id);
  }
  return { remover, manter };
}

function main() {
  const banco = JSON.parse(fs.readFileSync(BANCO_PATH, "utf-8"));
  const real = JSON.parse(fs.readFileSync(REAL_PATH, "utf-8"));
  const { remover } = planejarRemocao(banco, real);
  const saida = banco.filter((q) => !remover.has(q.id));
  console.log(`Removidas ${remover.size} questões:`);
  console.log([...remover].sort((a, b) => idNum(a) - idNum(b)).join(", "));
  console.log(`banco.json: ${banco.length} -> ${saida.length}`);
  fs.writeFileSync(BANCO_PATH, JSON.stringify(saida, null, 2) + "\n", "utf-8");
}

if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === pathToFileUrlSafe(process.argv[1])) {
  main();
}

function pathToFileUrlSafe(p) {
  try { return new URL(`file://${path.resolve(p)}`).href; } catch { return ""; }
}
```

Nota: o guard de `main()` no Windows é chato; se `node scripts/dedupe-banco.mjs` não disparar `main()`, simplificar para `if (process.argv[1] && process.argv[1].endsWith("dedupe-banco.mjs")) main();`.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `node --test scripts/dedupe-check.test.mjs`
Expected: PASS (3 testes).

- [ ] **Step 5: Rodar o dedupe de verdade e conferir o número**

Run: `node scripts/dedupe-banco.mjs`
Expected: `banco.json: 603 -> 544` (spec §4.1). Se der outro número, **parar** e conferir a lista de ids removidos no output contra os grupos citados na spec §1.1 (`banco-264/265/266/292/293/294/295/296`, `banco-129/130/131/132`, `banco-148/149/151/152`, `banco-310..313`, `banco-570..573`, `banco-455/457/461/462`, `banco-100`). Diferença pequena (±3) pode ser grupo real; documentar no commit. Diferença grande = bug no `norm()`.

- [ ] **Step 6: Revisar o diff manualmente**

Run: `git diff --stat src/data/questions/banco.json`
Inspecionar `git diff src/data/questions/banco.json` por amostragem: confirmar que cada bloco removido tem um gêmeo com enunciado idêntico que permaneceu, e que `enem-2010-176` **não** aparece no diff (ela está em `real.json`, intocada).

- [ ] **Step 7: Adicionar scripts ao `package.json`**

No bloco `"scripts"`, adicionar:

```json
"validate-all": "node scripts/validate-all.mjs",
"regen": "node scripts/generate.mjs && node scripts/validate-all.mjs"
```

- [ ] **Step 8: Commit**

```bash
git add scripts/dedupe-banco.mjs scripts/dedupe-check.test.mjs src/data/questions/banco.json package.json
git commit -m "Remove duplicatas exatas de banco.json (603 -> 544)"
```

---

### Task 2: PRNG semeado em `helpers.mjs`

**Files:**
- Modify: `scripts/helpers.mjs`
- Create: `scripts/rng.test.mjs`

**Interfaces:**
- Produces: `helpers.mjs` exporta `resetRng(seed?: number): void` (reseta o estado interno para `seed`, default `SEED = 20260828`) e `SEED`. `randInt(min,max)`, `randFloat(min,max,decimals?)`, `pick(arr)`, `shuffle(arr)` mantêm as mesmas assinaturas mas consomem o PRNG interno.
- Consumes: nada.

- [ ] **Step 1: Escrever o teste que falha**

Criar `scripts/rng.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { resetRng, randInt, shuffle, SEED } from "./helpers.mjs";

test("SEED é 20260828", () => {
  assert.equal(SEED, 20260828);
});

test("resetRng reproduz a mesma sequência de randInt", () => {
  resetRng();
  const a = Array.from({ length: 20 }, () => randInt(0, 1000));
  resetRng();
  const b = Array.from({ length: 20 }, () => randInt(0, 1000));
  assert.deepEqual(a, b);
});

test("sequências com sementes diferentes divergem", () => {
  resetRng(1);
  const a = Array.from({ length: 10 }, () => randInt(0, 1e6));
  resetRng(2);
  const b = Array.from({ length: 10 }, () => randInt(0, 1e6));
  assert.notDeepEqual(a, b);
});

test("shuffle é determinístico após resetRng", () => {
  resetRng();
  const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  resetRng();
  const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(a, b);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `node --test scripts/rng.test.mjs`
Expected: FAIL — `does not provide an export named 'resetRng'`.

- [ ] **Step 3: Implementar o PRNG**

No topo de `scripts/helpers.mjs`, substituir o bloco atual (`let idCounter = 0;` + as 4 funções aleatórias) por:

```js
export const SEED = 20260828;

let _rngState = SEED >>> 0;

// mulberry32 — PRNG determinístico de 32 bits
function _next() {
  _rngState = (_rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(_rngState ^ (_rngState >>> 15), 1 | _rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function resetRng(seed = SEED) {
  _rngState = seed >>> 0;
}

let idCounter = 0;

export function randInt(min, max) {
  return Math.floor(_next() * (max - min + 1)) + min;
}

export function randFloat(min, max, decimals = 2) {
  const v = _next() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

export function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

Deixar `nextId`, `gcd`, `simplifyFraction`, `brl`, `pct`, `bumpNumericText`, `buildAlternativas`, `makeQuestao`, `DIFICULDADES`, `dedupeByEnunciado` **como estão** (só passam a herdar o `_next` via `randInt`/`shuffle`). Adicionar um `export function resetIdCounter() { idCounter = 0; }` logo abaixo de `nextId` para os testes de `generate.mjs`.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `node --test scripts/rng.test.mjs`
Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
git add scripts/helpers.mjs scripts/rng.test.mjs
git commit -m "Adiciona PRNG mulberry32 semeado ao gerador de questões"
```

---

### Task 3: Novo algoritmo em `generate.mjs`

**Files:**
- Modify: `scripts/generate.mjs`
- Modify: `scripts/rng.test.mjs` (adicionar o teste de idempotência do gerador)

**Interfaces:**
- Consumes: `resetRng`, `resetIdCounter` de `helpers.mjs`; `TEMPLATES` de `templates.mjs`; `CATEGORIAS` de `categorias.mjs`.
- Produces: grava `src/data/questions/<cat>.json` (array, possivelmente `[]`) e `src/data/questions/_resumo.json` (`[{ categoriaId, real, banco, realLike, inedita, total }]`).

- [ ] **Step 1: Escrever o teste de idempotência**

Adicionar a `scripts/rng.test.mjs`:

```js
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

test("generate.mjs produz saída idêntica em duas execuções", () => {
  const dir = path.join(import.meta.dirname, "..", "src", "data", "questions");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "real.json" && f !== "banco.json");
  const hash = () => files.map((f) => fs.readFileSync(path.join(dir, f), "utf-8")).join(" ");
  execFileSync("node", ["scripts/generate.mjs"], { cwd: path.join(import.meta.dirname, "..") });
  const first = hash();
  execFileSync("node", ["scripts/generate.mjs"], { cwd: path.join(import.meta.dirname, "..") });
  assert.equal(hash(), first);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test scripts/rng.test.mjs`
Expected: FAIL — a saída muda entre execuções porque `generate.mjs` ainda não chama `resetRng`/`resetIdCounter` e ainda usa `Math.random` via o estado não resetado (a primeira execução após o import deixa o `_rngState` avançado).

- [ ] **Step 3: Reescrever `scripts/generate.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIAS } from "./categorias.mjs";
import { TEMPLATES } from "./templates.mjs";
import { DIFICULDADES, dedupeByEnunciado, resetRng, resetIdCounter } from "./helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "src", "data", "questions");
const REAL_PATH = path.join(OUT_DIR, "real.json");
const BANCO_PATH = path.join(OUT_DIR, "banco.json");

const META_TOTAL = 50;
const MAX_POR_TEMPLATE = 3;
const MAX_TENTATIVAS_POR_TEMPLATE = 40;

resetRng();
resetIdCounter();

const real = JSON.parse(fs.readFileSync(REAL_PATH, "utf-8"));
const banco = JSON.parse(fs.readFileSync(BANCO_PATH, "utf-8"));

const countPorCategoria = (arr) => {
  const m = {};
  for (const q of arr) m[q.categoriaId] = (m[q.categoriaId] ?? 0) + 1;
  return m;
};
const realCount = countPorCategoria(real);
const bancoCount = countPorCategoria(banco);

fs.mkdirSync(OUT_DIR, { recursive: true });

let totalIneditas = 0;
const resumo = [];

for (const categoriaId of CATEGORIAS) {
  const fns = TEMPLATES[categoriaId] ?? [];
  const rc = realCount[categoriaId] ?? 0;
  const bc = bancoCount[categoriaId] ?? 0;
  const realLike = rc + bc;
  const need = Math.max(0, META_TOTAL - realLike);

  let questoes = [];
  if (need > 0 && fns.length > 0) {
    for (const fn of fns) {
      if (questoes.length >= need) break;
      let geradas = 0;
      let difIdx = 0;
      let tentativas = 0;
      while (geradas < MAX_POR_TEMPLATE && questoes.length < need && tentativas < MAX_TENTATIVAS_POR_TEMPLATE) {
        tentativas++;
        const dificuldade = DIFICULDADES[difIdx % DIFICULDADES.length];
        let q;
        try {
          q = fn(dificuldade);
        } catch (e) {
          console.error(`Erro em ${categoriaId}/${fn.name}: ${e.message}`);
          continue;
        }
        const antes = questoes.length;
        questoes = dedupeByEnunciado([...questoes, q]);
        if (questoes.length > antes) {
          geradas++;
          difIdx++;
        }
      }
    }
  }

  const outPath = path.join(OUT_DIR, `${categoriaId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(questoes, null, 2), "utf-8");
  totalIneditas += questoes.length;
  const total = realLike + questoes.length;
  resumo.push({ categoriaId, real: rc, banco: bc, realLike, inedita: questoes.length, total });
  const flag = total < META_TOTAL && need > 0 ? "  ⚠ < 50" : "";
  console.log(`${categoriaId}: +${questoes.length} inéditas (realLike ${realLike}, total ${total})${flag}`);
}

console.log(`\nTotal de inéditas: ${totalIneditas}`);
fs.writeFileSync(path.join(OUT_DIR, "_resumo.json"), JSON.stringify(resumo, null, 2), "utf-8");
```

- [ ] **Step 4: Regenerar e conferir o resumo**

Run: `node scripts/generate.mjs`
Expected: as 6 categorias cheias (Números, Porcentagem, Razão e Proporção, Equações, Exp/Log, Geometria Plana) imprimem `+0 inéditas` e gravam `[]`. Total de inéditas ~85 (spec §7.5). Categorias raras imprimem `⚠ < 50` (esperado nesta fase — moldes novos vêm nas Fases 2+). Conferir `src/data/questions/_resumo.json`.

- [ ] **Step 5: Rodar o teste de idempotência e confirmar que passa**

Run: `node --test scripts/rng.test.mjs`
Expected: PASS (5 testes).

- [ ] **Step 6: Commit**

```bash
git add scripts/generate.mjs scripts/rng.test.mjs src/data/questions/
git commit -m "Reescreve generate.mjs: conta banco, teto de 3 por molde, categoria cheia gera []"
```

---

### Task 4: Validador global `validate-all.mjs`

**Files:**
- Create: `scripts/validate-all.mjs`
- Create: `scripts/validate-all.test.mjs`

**Interfaces:**
- Produces: `validate-all.mjs` exporta `validar(): { erros: string[], totais: {...} }` e, quando `main`, imprime e faz `process.exit(erros.length ? 1 : 0)`. Reusa `norm` de `./dedupe-banco.mjs`.
- Consumes: `CATEGORIAS` de `categorias.mjs`; `norm` de `dedupe-banco.mjs`; lê `src/data/categorias.ts` como texto para extrair `subtopicos` por categoria (mesmo regex do Step 3).

- [ ] **Step 1: Escrever o teste que falha**

Criar `scripts/validate-all.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validar } from "./validate-all.mjs";

test("o banco atual passa em todas as regras", () => {
  const { erros } = validar();
  assert.deepEqual(erros, [], erros.join("\n"));
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test scripts/validate-all.test.mjs`
Expected: FAIL — `Cannot find module './validate-all.mjs'`.

- [ ] **Step 3: Implementar `scripts/validate-all.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIAS } from "./categorias.mjs";
import { norm } from "./dedupe-banco.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "..", "src", "data", "questions");

function subtopicosPorCategoria() {
  const txt = fs.readFileSync(path.join(__dirname, "..", "src", "data", "categorias.ts"), "utf-8");
  const map = {};
  const re = /id:\s*"([^"]+)"[\s\S]*?subtopicos:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(txt))) {
    map[m[1]] = m[2].match(/"([^"]+)"/g).map((s) => s.slice(1, -1));
  }
  return map;
}

export function validar() {
  const erros = [];
  const subtopicos = subtopicosPorCategoria();
  const idsGlobais = new Map(); // id -> arquivo
  const enunciadosGlobais = new Map(); // enunciadoNorm -> "arquivo:id"

  const registrar = (q, arquivo) => {
    if (idsGlobais.has(q.id)) erros.push(`[ID DUPLICADO] ${q.id} em ${arquivo} e ${idsGlobais.get(q.id)}`);
    else idsGlobais.set(q.id, arquivo);
    const k = norm(q.enunciado);
    if (enunciadosGlobais.has(k)) erros.push(`[ENUNCIADO REPETIDO] ${arquivo}:${q.id} == ${enunciadosGlobais.get(k)}`);
    else enunciadosGlobais.set(k, `${arquivo}:${q.id}`);
  };

  const checarAlternativas = (q, arquivo, { exigir5 }) => {
    const textos = q.alternativas.map((a) => a.texto);
    const unicos = new Set(textos);
    if (unicos.size !== textos.length) erros.push(`[ALT DUPLICADA] ${arquivo}:${q.id}`);
    if (exigir5 && textos.length !== 5) erros.push(`[ALT != 5] ${arquivo}:${q.id} tem ${textos.length}`);
    if (!exigir5 && textos.length !== 4 && textos.length !== 5)
      erros.push(`[ALT != 4|5] ${arquivo}:${q.id} tem ${textos.length}`);
    const letras = q.alternativas.map((a) => a.letra);
    const esperadas = ["A", "B", "C", "D", "E"].slice(0, letras.length);
    if (JSON.stringify(letras) !== JSON.stringify(esperadas))
      erros.push(`[LETRAS FORA DE ORDEM] ${arquivo}:${q.id} ${letras}`);
    if (!letras.includes(q.correta)) erros.push(`[GABARITO INVALIDO] ${arquivo}:${q.id}`);
    const placeholders = textos.filter((t) => /^Nenhuma das alternativas|^Não é possível determinar/.test(t));
    if (placeholders.length > 1) erros.push(`[PLACEHOLDER EM EXCESSO] ${arquivo}:${q.id}`);
  };

  // inéditas por categoria
  for (const cat of CATEGORIAS) {
    const arquivo = `${cat}.json`;
    const qs = JSON.parse(fs.readFileSync(path.join(DIR, arquivo), "utf-8"));
    const porEstrutura = new Map(); // assinatura -> contagem
    for (const q of qs) {
      registrar(q, arquivo);
      checarAlternativas(q, arquivo, { exigir5: true });
      if (q.categoriaId !== cat) erros.push(`[CATEGORIA ERRADA] ${arquivo}:${q.id} -> ${q.categoriaId}`);
      if (subtopicos[cat] && !subtopicos[cat].includes(q.subtopico))
        erros.push(`[SUBTOPICO INVALIDO] ${arquivo}:${q.id} "${q.subtopico}"`);
      // assinatura de estrutura: enunciado com todos os números trocados por "#"
      const sig = q.enunciado.replace(/-?\d+(?:[.,]\d+)?/g, "#");
      porEstrutura.set(sig, (porEstrutura.get(sig) ?? 0) + 1);
    }
    for (const [sig, n] of porEstrutura)
      if (n > 3) erros.push(`[ESTRUTURA > 3] ${arquivo}: ${n}x "${sig.slice(0, 70)}..."`);
  }

  // real.json — 5 alternativas
  for (const q of JSON.parse(fs.readFileSync(path.join(DIR, "real.json"), "utf-8"))) {
    registrar(q, "real.json");
    checarAlternativas(q, "real.json", { exigir5: true });
  }
  // banco.json — 4 ou 5
  for (const q of JSON.parse(fs.readFileSync(path.join(DIR, "banco.json"), "utf-8"))) {
    registrar(q, "banco.json");
    checarAlternativas(q, "banco.json", { exigir5: false });
  }

  return { erros, totais: { ids: idsGlobais.size, enunciados: enunciadosGlobais.size } };
}

function main() {
  const { erros, totais } = validar();
  for (const e of erros) console.error(e);
  console.log(`\n${totais.ids} questões, ${totais.enunciados} enunciados únicos, ${erros.length} erros`);
  process.exit(erros.length ? 1 : 0);
}

if (process.argv[1] && process.argv[1].endsWith("validate-all.mjs")) main();
```

- [ ] **Step 4: Rodar o teste**

Run: `node --test scripts/validate-all.test.mjs`
Expected: pode **FALHAR** aqui listando `[ENUNCIADO REPETIDO]` ou `[ALT DUPLICADA]` que sobraram em `real.json`/`banco.json` (a dedupe da Task 1 só cobriu `banco.json` interno + cruzamento com `real.json`; pode haver duplicata **dentro** de `real.json`, ou par banco↔banco que o `norm` da Task 1 tratou mas o desta task vê diferente). 

- [ ] **Step 5: Resolver os erros remanescentes**

Para cada `[ENUNCIADO REPETIDO]` reportado:
- Se ambos os ids são `banco-*`: rodar `node scripts/dedupe-banco.mjs` de novo não resolve (já rodou) — remover a mão a de maior id de `banco.json` e anotar no commit.
- Se um é `real-*` e outro `banco-*`: remover a `banco-*` (regra da spec).
- Se ambos são `enem-*` (dentro de `real.json`): **não remover** — a spec proíbe mexer em `real.json` além do caso `banco-100`. Em vez disso, adicionar o par ao conjunto `IGNORAR_ENUNCIADO_REPETIDO` no `validate-all.mjs` com um comentário explicando (ex.: "ENEM 2016 e 2019 reciclaram o mesmo enunciado — ambos são questões oficiais legítimas"). Confirmar essa decisão com o usuário antes de codar o allowlist.

Repetir `node --test scripts/validate-all.test.mjs` até PASS.

- [ ] **Step 6: Rodar o portão completo**

Run: `node scripts/generate.mjs && node scripts/validate-all.mjs`
Expected: exit 0, `0 erros`.

- [ ] **Step 7: Commit**

```bash
git add scripts/validate-all.mjs scripts/validate-all.test.mjs src/data/questions/
git commit -m "Adiciona validate-all.mjs: cobre todos os JSONs, ids e enunciados únicos globais"
```

---

### Task 5: Contagem honesta na Sidebar

**Files:**
- Modify: `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `todasQuestoes` de `@/lib/questions`.

- [ ] **Step 1: Ver o estado atual**

Run: `git grep -n "1500+" src/`
Expected: uma ocorrência em `src/components/Sidebar.tsx`, dentro de `Logo()`.

- [ ] **Step 2: Tornar a contagem dinâmica**

Em `src/components/Sidebar.tsx`:
1. Adicionar ao topo: `import { todasQuestoes } from "@/lib/questions";`
2. Logo antes de `export function Logo()`:

```tsx
const TOTAL_QUESTOES = Math.floor(todasQuestoes.length / 100) * 100;
```

3. Trocar a linha `1500+ questões` por `{`${TOTAL_QUESTOES}+`} questões` (JSX: `{`${TOTAL_QUESTOES}+`} questões`).

Se `todasQuestoes.length` for ~900 após a Fase 1, exibe `900+ questões`. Após as Fases 2-9 sobe sozinho.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: sucesso. `Logo` é usado em Server e Client Components — `todasQuestoes` já é importado em páginas Server, então não quebra o boundary. Se o `build` reclamar de `"use client"` + import pesado, mover o cálculo para uma prop passada pelo layout; caso contrário deixar como está.

- [ ] **Step 4: Rodar dev e conferir visualmente**

Run: `npm run dev -- -p 3123` e abrir `http://localhost:3123` — a sidebar mostra `N00+ questões` com `N00` = `todasQuestoes.length` arredondado. Encerrar o dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "Sidebar: contagem de questões derivada de todasQuestoes.length"
```

---

### Task 6: Fechar a Fase 1

- [ ] **Step 1: Portão completo**

Run: `node --test scripts/*.test.mjs && node scripts/generate.mjs && node scripts/validate-all.mjs && npm run build`
Expected: tudo verde, `validate-all` com `0 erros`.

- [ ] **Step 2: Registrar o estado no resumo**

Conferir `src/data/questions/_resumo.json`: anotar no corpo do commit final da fase o `total` de cada categoria e quais ficaram `< 50` (todas as raras — serão resolvidas nas Fases 2+).

- [ ] **Step 3: Commit de fechamento (se houver algo não commitado)**

```bash
git add -A
git commit -m "Fase 1 concluída: banco ~900 questões, nenhuma estrutura inédita > 3"
```

---

## FASES 2-9 — Expansão de moldes

**Todas as fases seguem a MESMA receita.** A lista de moldes e as fórmulas de cada um estão na **spec §6** (`docs/superpowers/specs/2026-08-28-dedupe-e-variedade-questoes-design.md`) — o executor lê a spec §6 da categoria da fase e implementa item a item. Não repetir as fórmulas aqui; elas já estão completas e exatas na spec.

### Receita por fase (aplicar a cada Task 7-15)

**Files (todas as fases):**
- Modify: `scripts/templates.mjs` — adicionar as funções-molde novas e registrá-las no objeto `TEMPLATES[<categoria>]`.
- Create: `docs/verificacao-moldes/<categoria>.md` — verificação manual.
- Modify: `src/data/questions/<categoria>.json` + `_resumo.json` (efeito de `generate.mjs`).

**Padrão de código de cada molde** (copiar a estrutura de um molde existente da mesma categoria ou vizinha):
- Assinatura `function <nomeMolde>(dificuldade) { ... return makeQuestao({...}); }`.
- `categoriaId` = o id da categoria da fase.
- `subtopico` = **exatamente** um item da lista de `src/data/categorias.ts` (extraída acima):
  - `regra-de-tres`: `"Regra de Três Simples"` | `"Regra de Três Composta"` | `"Conversão de Medidas e Unidades"`
  - `trigonometria`: `"Triângulo Retângulo"` | `"Lei dos Senos"` | `"Lei dos Cossenos"`
  - `matematica-financeira`: `"Juros Compostos"` | `"Taxas Equivalentes"` | `"Financiamentos e Prestações"`
  - `funcao-afim`: `"f(x) = ax + b"` | `"Coeficiente Angular"` | `"Tarifas e Planos"`
  - `logica`: `"Proposições Lógicas"` | `"Sequências e Padrões"` | `"Problemas de Raciocínio"`
  - `probabilidade`: `"Probabilidade Simples"` | `"Probabilidade Condicional"` | `"Eventos Sucessivos"`
  - `analise-combinatoria`: `"Princípio Multiplicativo"` | `"Arranjo"` | `"Combinação"` | `"Permutação"`
  - `funcao-quadratica`: `"Vértice da Parábola"` | `"Pontos de Máximo e Mínimo"` | `"Raízes e Concavidade"`
  - `geometria-analitica`: `"Distância entre Pontos"` | `"Equação da Reta"` | `"Equação da Circunferência"`
  - `conjuntos`: `"União e Interseção"` | `"Diagramas de Venn"` | `"Problemas de Pesquisa"`
  - `matrizes`: `"Operações com Matrizes"` | `"Determinantes"` | `"Aplicações Práticas"`
- **Resposta certa calculada em código.** Escolher os parâmetros para o resultado ser limpo (inteiro ou raiz exata) — usar `ANGULOS` (já no arquivo) para trigonometria, `TRIPLAS_PITAGORICAS` para distâncias, coeficientes com Δ quadrado perfeito para Bhaskara.
- **`distractorTexts`: 4 erros clássicos calculados** (trocar sinal, esquecer de dividir por 2, usar sen no lugar de tan, somar em vez de multiplicar…), nunca `randInt` puro. Se um distrator colidir com a resposta o `buildAlternativas` cai no fallback de "bump numérico" e depois nos placeholders — o `validate-all` sinaliza `[PLACEHOLDER EM EXCESSO]`; nesse caso, ajustar os distratores do molde.
- `explicacao`: 1-3 frases mostrando a conta com os números da questão.
- Pool de 3-5 cenários/contexto via `pick([...])` quando fizer sentido (ver `numFracaoOperacoes`, `conjDiferenca` como modelo).
- Registrar no `TEMPLATES`: `<categoria>: [<molde antigo>, ..., <molde novo>, ...]`.

- [ ] **Step 1: Escrever todos os moldes da categoria** (spec §6 da categoria).
- [ ] **Step 2: Registrar cada um em `TEMPLATES`.**
- [ ] **Step 3: Resolver à mão um exemplo de cada molde novo.** Criar `docs/verificacao-moldes/<categoria>.md` com, por molde: o enunciado gerado (rodar `node -e` chamando o molde), a resolução manual passo a passo, e a letra correta que o gerador atribuiu. Conferir que batem. **Se não bater, o molde está errado — corrigir antes de seguir.**
- [ ] **Step 4: Regenerar.** Run: `node scripts/generate.mjs` — conferir no `_resumo.json` que a categoria subiu para `total` ~50 (ou o máximo documentado para Matrizes/Conjuntos/Geo. Analítica).
- [ ] **Step 5: Validar.** Run: `node scripts/validate-all.mjs` — exit 0. Corrigir qualquer `[SUBTOPICO INVALIDO]`, `[ESTRUTURA > 3]`, `[PLACEHOLDER EM EXCESSO]`, `[ENUNCIADO REPETIDO]`.
- [ ] **Step 6: Build.** Run: `npm run build` — sucesso.
- [ ] **Step 7: Commit.** `git add scripts/templates.mjs docs/verificacao-moldes/<categoria>.md src/data/questions/ && git commit -m "Adiciona N moldes de <categoria>"`

### Ordem das fases (maior carência primeiro — spec §7)

| Task | Fase | Categoria(s) | Moldes novos | Alvo `total` |
|---|---|---|--:|---|
| 7 | 2 | Matrizes e Determinantes | +16 | ~50 (aceitar 35-45 se esgotar) |
| 8 | 3 | Conjuntos | +14 | ~50 (aceitar 35-45 se esgotar) |
| 9 | 4 | Geometria Analítica | +13 | ~50 (aceitar 35-45 se esgotar) |
| 10 | 5 | Função Quadrática | +10 | ~50 |
| 11 | 6 | Lógica e Raciocínio (+7), Análise Combinatória (+7) | +14 | ~50 cada |
| 12 | 7 | Função Afim (+6), Probabilidade (+6) | +12 | ~50 cada |
| 13 | 8 | Trigonometria (+5), Matemática Financeira (+5) | +10 | ~50 cada |
| 14 | 9 | Regra de Três (+2) | +2 | ~50 |
| 15 | — | Fechamento: atualizar a spec §5 com os `total` reais, rodar o portão completo, commit final | — | — |

Nas fases com duas categorias (11, 12, 13): fazer uma categoria por vez, cada uma com seu próprio ciclo Steps 1-7 e seu próprio commit.

### Task 15: Fechamento

- [ ] **Step 1:** `node --test scripts/*.test.mjs && node scripts/generate.mjs && node scripts/validate-all.mjs && npm run build` — tudo verde.
- [ ] **Step 2:** Atualizar a tabela da spec §5 (`estado-alvo por categoria`) com a coluna `total` **real** de cada categoria, a partir do `_resumo.json`. Anotar quais categorias fecharam abaixo de 50 e o número atingido.
- [ ] **Step 3:** Conferir a "Definição de pronto" da spec §9 item a item.
- [ ] **Step 4:** `git add -A && git commit -m "Fecha spec de dedupe e variedade: banco em ~1000 questões, nenhuma estrutura > 3"`

---

## Self-Review

**Spec coverage:**
- §4.1 dedupe `banco.json` → Task 1. ✓
- §4.2 PRNG semeado → Task 2. ✓
- §4.3 novo algoritmo `generate.mjs` → Task 3. ✓
- §4.4 expansão de moldes → Tasks 7-14 (via receita + spec §6). ✓
- §4.5 `validate-all.mjs` → Task 4 (todas as 6 checagens: alternativas, gabarito+ordem, ids únicos globais, enunciado único global, teto de 3 por estrutura, subtopico válido). ✓
- §4.6 ajustes na app (Sidebar dinâmica; `assuntos`/`aleatoria` já usam `.length`; build por fase) → Task 5 + portão de cada fase. ✓
- §5 estado-alvo por categoria → Task 3 (algoritmo) + Task 15 Step 2 (registro do real). ✓
- §6 catálogo de moldes → consumido diretamente pelas Tasks 7-14. ✓
- §7 fases → Tasks 1-6 (Fase 1) e 7-15 (Fases 2-9). ✓
- §8 riscos → mitigações embutidas: "resolver à mão" (Step 3 da receita), placeholder em excesso (`validate-all`), PRNG estabiliza ids (Task 2), revisão manual do diff (Task 1 Step 6). ✓
- §9 definição de pronto → Task 15 Step 3. ✓

**Placeholder scan:** Fase 1 tem código real e completo em todos os steps. Fases 2-9 delegam o conteúdo dos moldes à spec §6 (que tem as fórmulas exatas) por serem ~92 itens repetitivos do mesmo padrão — cada um com portão de verificação manual obrigatório. Isso é decisão consciente de granularidade, não placeholder: a receita é executável como está.

**Type consistency:** `norm` (Task 1) reusado em Task 4. `resetRng`/`resetIdCounter`/`SEED` (Task 2) consumidos em Task 3 e nos testes. `validar()` retorna `{ erros, totais }` — usado igual no teste e no `main()`. `TEMPLATES[categoria]` é array de `(dificuldade) => Questao` em todo lugar. `_resumo.json` ganha campos `banco` e `realLike` novos (Task 3) — só `generate.mjs` escreve e nada além do `_resumo` os lê.

**Gap conhecido / decisão pendente:** Task 4 Step 5 pode exigir confirmação do usuário sobre um allowlist de enunciados repetidos legítimos **dentro** de `real.json` (ENEM que reciclou questão entre anos). Sinalizado no step.

---

## Execution Handoff

Plano salvo em `docs/superpowers/plans/2026-08-28-dedupe-e-variedade-questoes.md`.
