import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIAS } from "./categorias.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUMOS_DIR = path.join(__dirname, "..", "src", "data", "resumos");
const CATEGORIAS_TS = path.join(__dirname, "..", "src", "data", "categorias.ts");

// Extrai { id, subtopicos } de src/data/categorias.ts via regex (arquivo estático e simples;
// evita duplicar a lista de subtópicos aqui e evita depender de um loader de TypeScript).
const fonte = fs.readFileSync(CATEGORIAS_TS, "utf-8");
const subtopicosPorCategoria = {};
const blocoRegex = /id:\s*"([^"]+)"[\s\S]*?subtopicos:\s*\[([^\]]*)\]/g;
let m;
while ((m = blocoRegex.exec(fonte))) {
  const [, id, listaBruta] = m;
  const subtopicos = [...listaBruta.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  subtopicosPorCategoria[id] = subtopicos;
}

let totalErros = 0;
let totalSubtopicosComResumo = 0;

for (const categoriaId of CATEGORIAS) {
  const validos = subtopicosPorCategoria[categoriaId];
  if (!validos) {
    console.error(`[SEM ENTRADA EM categorias.ts] ${categoriaId}`);
    totalErros++;
    continue;
  }

  const file = path.join(RESUMOS_DIR, `${categoriaId}.json`);
  if (!fs.existsSync(file)) {
    console.error(`[ARQUIVO FALTANDO] ${file}`);
    totalErros++;
    continue;
  }

  const resumo = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (resumo.categoriaId !== categoriaId) {
    console.error(`[categoriaId DIVERGENTE] ${file}: esperado "${categoriaId}", encontrado "${resumo.categoriaId}"`);
    totalErros++;
  }

  const vistos = new Set();
  for (const s of resumo.subtopicos) {
    totalSubtopicosComResumo++;

    if (!validos.includes(s.subtopico)) {
      console.error(`[SUBTOPICO INVALIDO] ${categoriaId}: "${s.subtopico}" não está em categorias.ts (${JSON.stringify(validos)})`);
      totalErros++;
    }
    if (vistos.has(s.subtopico)) {
      console.error(`[SUBTOPICO DUPLICADO] ${categoriaId}: "${s.subtopico}"`);
      totalErros++;
    }
    vistos.add(s.subtopico);

    if (!Array.isArray(s.pontos) || s.pontos.length === 0) {
      console.error(`[PONTOS VAZIOS] ${categoriaId} / ${s.subtopico}`);
      totalErros++;
    }
    if (!s.exemplo || typeof s.exemplo.enunciado !== "string" || s.exemplo.enunciado.trim() === "") {
      console.error(`[EXEMPLO SEM ENUNCIADO] ${categoriaId} / ${s.subtopico}`);
      totalErros++;
    }
    if (!s.exemplo || !Array.isArray(s.exemplo.resolucao) || s.exemplo.resolucao.length === 0) {
      console.error(`[RESOLUCAO VAZIA] ${categoriaId} / ${s.subtopico}`);
      totalErros++;
    }
  }
}

console.log(`\nCategorias verificadas: ${CATEGORIAS.length}`);
console.log(`Subtópicos com resumo escrito: ${totalSubtopicosComResumo}`);
console.log(`Total de erros encontrados: ${totalErros}`);
process.exit(totalErros > 0 ? 1 : 0);
