"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularConquistas, contarDominadas } from "@/lib/gamificacao";
import type { Categoria } from "@/lib/types";
import ResultShareCard from "@/components/ResultShareCard";
import PatenteCard from "@/components/PatenteCard";
import AtividadeHeatmap from "@/components/AtividadeHeatmap";
import ConquistasGrid from "@/components/ConquistasGrid";

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

  const desempenhoPorCategoria = useMemo(
    () =>
      categorias.map(({ categoria, questaoIds }) => ({
        categoria,
        stats: calcularEstatisticas(registros, questaoIds),
      })),
    [registros, categorias]
  );

  const porCategoria = useMemo(
    () =>
      desempenhoPorCategoria
        .filter((c) => c.stats.respondidas > 0)
        .sort((a, b) => b.stats.respondidas - a.stats.respondidas),
    [desempenhoPorCategoria]
  );

  const dominadas = useMemo(() => contarDominadas(desempenhoPorCategoria), [desempenhoPorCategoria]);
  const conquistas = useMemo(
    () => calcularConquistas(registros, dominadas, categorias.length),
    [registros, dominadas, categorias.length]
  );

  return (
    <div className="space-y-8">
      <PatenteCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Resolvidas</p>
          <p className="font-display text-2xl font-bold text-white tabular-nums">
            {stats.respondidas} / {questaoIdsGlobal.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Acertos</p>
          <p className="font-display text-2xl font-bold text-white tabular-nums">
            {stats.acertoPct !== null ? `${stats.acertoPct}%` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">Categorias praticadas</p>
          <p className="font-display text-2xl font-bold text-white tabular-nums">
            {porCategoria.length} / {categorias.length}
          </p>
        </div>
      </div>

      <ResultShareCard nome={nome ?? "Visitante"} stats={stats} />

      <AtividadeHeatmap />

      {porCategoria.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Por assunto</h2>
          <div className="space-y-2">
            {porCategoria.map(({ categoria, stats: s }) => (
              <div
                key={categoria.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm"
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

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Conquistas</h2>
        <ConquistasGrid conquistas={conquistas} />
      </div>
    </div>
  );
}
