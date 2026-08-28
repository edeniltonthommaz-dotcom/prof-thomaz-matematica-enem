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
    // marcador ordinal: normaliza para a letra (º/° -> o, ª -> a) para que
    // "2º grau" == "2o grau" == "2° grau" (grupo banco-204/205 no banco real).
    .replace(/[ºª°]/g, (m) => (m === "ª" ? "a" : "o"))
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

if (process.argv[1] && process.argv[1].endsWith("dedupe-banco.mjs")) {
  main();
}
