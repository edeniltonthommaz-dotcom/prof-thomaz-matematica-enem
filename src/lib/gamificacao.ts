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

export interface DesempenhoCategoria {
  categoria: Categoria;
  stats: { respondidas: number; acertos: number; acertoPct: number | null };
}

/**
 * Reimplementa a mesma lógica de `calcularEstatisticas` (progress.ts) em vez de importá-la:
 * progress.ts tem "use client" e importa @supabase/supabase-js, então um import de valor
 * puxaria isso para o grafo de módulos deste arquivo. `import type` (já usado acima para
 * ProgressoMap) não sofre esse problema porque é apagado na compilação — mas esta função
 * usa a lógica em runtime, não só o tipo, daí a duplicação deliberada.
 */
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
