import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIAS } from "./categorias.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "..", "src", "data", "questions");

let totalErros = 0;
let totalQuestoes = 0;

for (const categoriaId of CATEGORIAS) {
  const file = path.join(DIR, `${categoriaId}.json`);
  const questoes = JSON.parse(fs.readFileSync(file, "utf-8"));
  totalQuestoes += questoes.length;
  for (const q of questoes) {
    const textos = q.alternativas.map((a) => a.texto);
    const unicos = new Set(textos);
    if (unicos.size !== 5) {
      console.error(`[DUPLICATA] ${q.id}: ${JSON.stringify(textos)}`);
      totalErros++;
    }
    if (!q.alternativas.some((a) => a.letra === q.correta)) {
      console.error(`[GABARITO INVALIDO] ${q.id}`);
      totalErros++;
    }
    const letrasEsperadas = ["A", "B", "C", "D", "E"];
    const letrasReais = q.alternativas.map((a) => a.letra);
    if (JSON.stringify(letrasReais) !== JSON.stringify(letrasEsperadas)) {
      console.error(`[LETRAS FORA DE ORDEM] ${q.id}: ${letrasReais}`);
      totalErros++;
    }
  }
}

console.log(`\nTotal de questões inéditas verificadas: ${totalQuestoes}`);
console.log(`Total de erros encontrados: ${totalErros}`);
process.exit(totalErros > 0 ? 1 : 0);
