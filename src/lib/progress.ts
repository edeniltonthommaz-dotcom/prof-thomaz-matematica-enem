"use client";

const STORAGE_KEY = "enem-questoes-progresso-v1";

export interface RegistroResposta {
  respondida: true;
  correta: boolean;
  alternativaEscolhida: string;
  timestamp: number;
}

type ProgressoMap = Record<string, RegistroResposta>;

const EMPTY: ProgressoMap = {};
let cache: ProgressoMap | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): ProgressoMap {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressoMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressoMap) {
  cache = map;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
  listeners.forEach((l) => l());
}

/** Snapshot estável para uso com useSyncExternalStore (só muda de referência quando o progresso muda de fato). */
export function getSnapshot(): ProgressoMap {
  if (!cache) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): ProgressoMap {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function registrarResposta(questaoId: string, correta: boolean, alternativaEscolhida: string) {
  const map = { ...getSnapshot() };
  map[questaoId] = { respondida: true, correta, alternativaEscolhida, timestamp: Date.now() };
  writeAll(map);
}

export function limparProgresso() {
  writeAll({});
}

export interface EstatisticasGerais {
  respondidas: number;
  acertos: number;
  acertoPct: number | null;
}

export function calcularEstatisticas(registros: ProgressoMap, questaoIds: string[]): EstatisticasGerais {
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
    respondidas,
    acertos,
    acertoPct: respondidas > 0 ? Math.round((acertos / respondidas) * 100) : null,
  };
}
