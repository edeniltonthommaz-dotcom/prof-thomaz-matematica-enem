"use client";

import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "enem-questoes-progresso-v1";
const TABLE = "progresso_questoes";

export interface RegistroResposta {
  respondida: true;
  correta: boolean;
  alternativaEscolhida: string;
  timestamp: number;
}

export type ProgressoMap = Record<string, RegistroResposta>;

interface LinhaProgresso {
  questao_id: string;
  correta: boolean;
  alternativa_escolhida: string;
  updated_at: string;
}

const EMPTY: ProgressoMap = {};
let cache: ProgressoMap | null = null;
const listeners = new Set<() => void>();

/** Usuário logado atual. Quando definido, novas respostas vão para o Supabase em vez do localStorage. */
let currentUserId: string | null = null;

function readFromStorage(): ProgressoMap {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressoMap) : {};
  } catch {
    return {};
  }
}

function applyLocal(map: ProgressoMap) {
  cache = map;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
  listeners.forEach((l) => l());
}

/** Atualiza a cache/observadores sem tocar no localStorage (usado quando logado, fonte da verdade é o Supabase). */
function applyRemote(map: ProgressoMap) {
  cache = map;
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

  if (currentUserId) {
    const userId = currentUserId;
    applyRemote(map);
    const supabase = createClient();
    supabase
      .from(TABLE)
      .upsert(
        {
          user_id: userId,
          questao_id: questaoId,
          correta,
          alternativa_escolhida: alternativaEscolhida,
        },
        { onConflict: "user_id,questao_id" }
      )
      .then(({ error }) => {
        if (error) console.error("Falha ao salvar resposta no Supabase:", error);
      });
  } else {
    applyLocal(map);
  }
}

export function limparProgresso() {
  applyLocal({});
}

/**
 * Chamada quando um login é confirmado (evento SIGNED_IN, ou reidratação no mount
 * de um usuário já logado via SSR). Busca o progresso do Supabase, mescla com o que
 * houver no localStorage do dispositivo (progresso de visitante, remoto vence em
 * conflito) e sobe para o Supabase o que só existia localmente.
 */
export async function hydrateFromSupabase(userId: string): Promise<void> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("questao_id, correta, alternativa_escolhida, updated_at")
    .eq("user_id", userId);

  if (error) {
    console.error("Falha ao carregar progresso do Supabase:", error);
    return;
  }

  const remoto: ProgressoMap = {};
  for (const row of (data ?? []) as LinhaProgresso[]) {
    remoto[row.questao_id] = {
      respondida: true,
      correta: row.correta,
      alternativaEscolhida: row.alternativa_escolhida,
      timestamp: new Date(row.updated_at).getTime(),
    };
  }

  const local = readFromStorage();
  const somenteLocal = Object.entries(local).filter(([id]) => !(id in remoto));

  if (somenteLocal.length > 0) {
    const linhas = somenteLocal.map(([questaoId, r]) => ({
      user_id: userId,
      questao_id: questaoId,
      correta: r.correta,
      alternativa_escolhida: r.alternativaEscolhida,
    }));
    const { error: upsertError } = await supabase
      .from(TABLE)
      .upsert(linhas, { onConflict: "user_id,questao_id" });
    if (upsertError) {
      console.error("Falha ao migrar progresso local para o Supabase:", upsertError);
    }
  }

  currentUserId = userId;
  applyRemote({ ...local, ...remoto });
}

/** Chamada no logout: volta a ler/gravar progresso no localStorage do dispositivo. */
export function resetToGuest(): void {
  currentUserId = null;
  applyRemote(readFromStorage());
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
