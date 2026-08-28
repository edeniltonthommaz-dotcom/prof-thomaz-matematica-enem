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

  // Guard de determinismo: templates.mjs não pode usar Math.random() — todo sorteio
  // tem que passar pelo PRNG semeado de helpers.mjs, senão a geração deixa de ser
  // reprodutível byte a byte.
  const templatesTxt = fs.readFileSync(path.join(__dirname, "templates.mjs"), "utf-8");
  if (/Math\.random\s*\(/.test(templatesTxt))
    erros.push(
      "[MATH.RANDOM EM TEMPLATES] scripts/templates.mjs usa Math.random() — geração deixa de ser determinística",
    );

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
