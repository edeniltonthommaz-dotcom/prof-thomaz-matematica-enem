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

export function brl(v) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function pct(v) {
  return v % 1 === 0 ? `${v}%` : `${v.toFixed(1)}%`;
}

export function nextId(categoriaId) {
  idCounter += 1;
  return `${categoriaId}-ined-${idCounter.toString().padStart(4, "0")}`;
}

export function resetIdCounter() {
  idCounter = 0;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
export { gcd };

export function simplifyFraction(num, den) {
  const g = gcd(num, den);
  return [num / g, den / g];
}

/**
 * Constrói as alternativas embaralhando o valor correto com os distratores,
 * atribuindo letras A-E na ordem final. Remove distratores duplicados do valor
 * correto ou entre si (tenta gerar substituto simples se colidir).
 */
function bumpNumericText(text, delta) {
  const m = text.match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return null;
  const raw = m[0];
  const hasComma = raw.includes(",");
  const normalized = raw.replace(",", ".");
  const decimals = normalized.includes(".") ? normalized.split(".")[1].length : 0;
  const bumped = Number(normalized) + delta;
  let numStr = decimals > 0 ? bumped.toFixed(decimals) : String(Math.round(bumped));
  if (hasComma) numStr = numStr.replace(".", ",").replace("-,", "-");
  return text.slice(0, m.index) + numStr + text.slice(m.index + raw.length);
}

export function buildAlternativas(correctText, distractorTexts) {
  const letras = ["A", "B", "C", "D", "E"];
  const seen = new Set([correctText]);
  const distinctDistractors = [];
  for (const d of distractorTexts) {
    if (!seen.has(d)) {
      seen.add(d);
      distinctDistractors.push(d);
    }
  }
  // Nunca deixar a resposta correta "vazar" num texto de distrator: gera variantes
  // numericamente próximas (mas distintas) em vez de reaproveitar correctText.
  const deltas = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10, 4, -4];
  let deltaIdx = 0;
  while (distinctDistractors.length < 4 && deltaIdx < deltas.length) {
    const base = distinctDistractors[distinctDistractors.length - 1] ?? correctText;
    const candidate = bumpNumericText(base, deltas[deltaIdx]);
    deltaIdx++;
    if (candidate && !seen.has(candidate)) {
      seen.add(candidate);
      distinctDistractors.push(candidate);
    }
  }
  const placeholders = ["Nenhuma das alternativas anteriores", "Não é possível determinar com os dados fornecidos"];
  let placeholderIdx = 0;
  while (distinctDistractors.length < 4 && placeholderIdx < placeholders.length) {
    if (!seen.has(placeholders[placeholderIdx])) distinctDistractors.push(placeholders[placeholderIdx]);
    placeholderIdx++;
  }
  const pool = shuffle([
    { texto: correctText, correta: true },
    ...distinctDistractors.slice(0, 4).map((t) => ({ texto: t, correta: false })),
  ]);
  const alternativas = pool.map((item, i) => ({ letra: letras[i], texto: item.texto }));
  const correta = alternativas[pool.findIndex((p) => p.correta)].letra;
  return { alternativas, correta };
}

export function makeQuestao({
  categoriaId,
  subtopico,
  dificuldade,
  enunciado,
  correctText,
  distractorTexts,
  explicacao,
  distratores,
  diagrama,
}) {
  const { alternativas, correta } = buildAlternativas(correctText, distractorTexts);
  return {
    id: nextId(categoriaId),
    categoriaId,
    subtopico,
    dificuldade,
    fonte: { tipo: "inedita" },
    enunciado,
    alternativas,
    correta,
    explicacao,
    ...(distratores ? { distratores } : {}),
    ...(diagrama ? { diagrama } : {}),
  };
}

export const DIFICULDADES = ["facil", "medio", "dificil"];

export function dedupeByEnunciado(questoes) {
  const seen = new Set();
  const out = [];
  for (const q of questoes) {
    if (!seen.has(q.enunciado)) {
      seen.add(q.enunciado);
      out.push(q);
    }
  }
  return out;
}
