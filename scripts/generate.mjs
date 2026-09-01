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
