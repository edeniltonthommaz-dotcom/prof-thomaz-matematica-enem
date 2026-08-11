import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIAS } from "./categorias.mjs";
import { TEMPLATES } from "./templates.mjs";
import { DIFICULDADES, dedupeByEnunciado } from "./helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "src", "data", "questions");
const REAL_PATH = path.join(OUT_DIR, "real.json");
const DEFAULT_TARGET = 10;
const META_TOTAL = 50;

const realQuestoes = JSON.parse(fs.readFileSync(REAL_PATH, "utf-8"));
const realCountPorCategoria = {};
for (const q of realQuestoes) {
  realCountPorCategoria[q.categoriaId] = (realCountPorCategoria[q.categoriaId] ?? 0) + 1;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let totalGeral = 0;
const resumo = [];

for (const categoriaId of CATEGORIAS) {
  const fns = TEMPLATES[categoriaId];
  if (!fns || fns.length === 0) {
    console.warn(`(!) Sem templates para categoria: ${categoriaId}`);
    continue;
  }
  const realCount = realCountPorCategoria[categoriaId] ?? 0;
  const TARGET_PER_CATEGORIA = Math.max(DEFAULT_TARGET, META_TOTAL - realCount);
  const MAX_TENTATIVAS = TARGET_PER_CATEGORIA * 15;
  let questoes = [];
  let tentativas = 0;
  let fnIndex = 0;
  let difIndex = 0;
  while (questoes.length < TARGET_PER_CATEGORIA && tentativas < MAX_TENTATIVAS) {
    const fn = fns[fnIndex % fns.length];
    const dificuldade = DIFICULDADES[difIndex % DIFICULDADES.length];
    try {
      const q = fn(dificuldade);
      questoes.push(q);
    } catch (e) {
      console.error(`Erro gerando questão de ${categoriaId}:`, e.message);
    }
    fnIndex++;
    difIndex++;
    tentativas++;
    questoes = dedupeByEnunciado(questoes);
  }
  const outPath = path.join(OUT_DIR, `${categoriaId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(questoes, null, 2), "utf-8");
  totalGeral += questoes.length;
  resumo.push({ categoriaId, real: realCount, inedita: questoes.length, total: realCount + questoes.length });
  console.log(`${categoriaId}: ${questoes.length} questões geradas (real: ${realCount}, total: ${realCount + questoes.length})`);
}

console.log(`\nTotal geral (inéditas): ${totalGeral}`);
fs.writeFileSync(path.join(OUT_DIR, "_resumo.json"), JSON.stringify(resumo, null, 2), "utf-8");
