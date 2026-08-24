"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Flame } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { diasAtivos, calcularSequencia, construirHeatmap } from "@/lib/gamificacao";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function corPorContagem(n: number): string {
  if (n === 0) return "bg-white/5";
  if (n === 1) return "bg-gray-400/30";
  if (n <= 3) return "bg-gray-400/60";
  return "bg-gray-400";
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function AtividadeHeatmap() {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dias = useMemo(() => diasAtivos(registros), [registros]);
  const sequencia = useMemo(() => calcularSequencia(dias), [dias]);
  const heatmapDados = useMemo(() => construirHeatmap(registros), [registros]);

  const semanas = chunk(heatmapDados, 7);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Dias de Estudo</h2>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className={`h-3.5 w-3.5 ${sequencia.atual > 0 ? "text-amber-400" : "text-slate-500"}`} />
            {sequencia.atual} {sequencia.atual === 1 ? "dia seguido" : "dias seguidos"}
          </span>
          <span>Recorde: {sequencia.recorde} {sequencia.recorde === 1 ? "dia" : "dias"}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div
            className="grid h-3 gap-[3px] text-[10px] leading-3 text-slate-500"
            style={{ gridTemplateColumns: `repeat(${semanas.length}, 12px)` }}
          >
            {semanas.map((semana, i) => {
              const dataPrimeiroDia = new Date(`${semana[0].data}T00:00:00`);
              const mesAnterior = i > 0 ? new Date(`${semanas[i - 1][0].data}T00:00:00`).getMonth() : null;
              const mostrarLabel = dataPrimeiroDia.getMonth() !== mesAnterior;
              return (
                <span key={semana[0].data} className="relative overflow-visible whitespace-nowrap">
                  {mostrarLabel ? MESES[dataPrimeiroDia.getMonth()] : ""}
                </span>
              );
            })}
          </div>

          <div
            className="grid gap-[3px]"
            style={{ gridTemplateRows: "repeat(7, 12px)", gridAutoFlow: "column", gridAutoColumns: "12px" }}
          >
            {heatmapDados.map((d) => (
              <div
                key={d.data}
                title={`${d.data}: ${d.contagem} questão${d.contagem === 1 ? "" : "es"}`}
                className={`h-3 w-3 rounded-sm ${corPorContagem(d.contagem)}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
        menos
        <span className="h-3 w-3 rounded-sm bg-white/5" />
        <span className="h-3 w-3 rounded-sm bg-gray-400/30" />
        <span className="h-3 w-3 rounded-sm bg-gray-400/60" />
        <span className="h-3 w-3 rounded-sm bg-gray-400" />
        mais
      </div>
    </div>
  );
}
