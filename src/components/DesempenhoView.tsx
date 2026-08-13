"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import type { Categoria } from "@/lib/types";
import ResultShareCard from "@/components/ResultShareCard";

export default function DesempenhoView({
  nome,
  questaoIdsGlobal,
  categorias,
}: {
  nome: string | null;
  questaoIdsGlobal: string[];
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stats = useMemo(
    () => calcularEstatisticas(registros, questaoIdsGlobal),
    [registros, questaoIdsGlobal]
  );

  const porCategoria = useMemo(
    () =>
      categorias
        .map(({ categoria, questaoIds }) => ({
          categoria,
          stats: calcularEstatisticas(registros, questaoIds),
        }))
        .filter((c) => c.stats.respondidas > 0)
        .sort((a, b) => b.stats.respondidas - a.stats.respondidas),
    [registros, categorias]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Resolvidas</p>
          <p className="text-2xl font-bold text-white">
            {stats.respondidas} / {questaoIdsGlobal.length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Acertos</p>
          <p className="text-2xl font-bold text-white">
            {stats.acertoPct !== null ? `${stats.acertoPct}%` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Categorias praticadas</p>
          <p className="text-2xl font-bold text-white">
            {porCategoria.length} / {categorias.length}
          </p>
        </div>
      </div>

      <ResultShareCard nome={nome ?? "Visitante"} stats={stats} />

      {porCategoria.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Por assunto</h2>
          <div className="space-y-2">
            {porCategoria.map(({ categoria, stats: s }) => (
              <div
                key={categoria.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm"
              >
                <span className="text-slate-200">{categoria.nome}</span>
                <span className="text-slate-400">
                  {s.respondidas} respondidas ·{" "}
                  {s.acertoPct !== null ? `${s.acertoPct}%` : "—"} de acerto
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
