"use client";

import { useMemo, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularXpTotal, calcularPatente, PATENTES } from "@/lib/gamificacao";

export default function PatenteCard() {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const xpTotal = useMemo(() => calcularXpTotal(registros), [registros]);
  const statusPatente = useMemo(() => calcularPatente(xpTotal), [xpTotal]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/12 font-display text-xl font-bold text-accent-soft">
            {statusPatente.patente.numero}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Patente {statusPatente.patente.numero}
            </p>
            <p className="font-display text-xl font-bold text-white">{statusPatente.patente.titulo}</p>
          </div>
        </div>
        <div className="min-w-[14rem] flex-1">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>Progresso da patente</span>
            <span>
              {statusPatente.proximaPatente
                ? `${statusPatente.xpNaPatenteAtual} / ${statusPatente.xpNecessarioProximaPatente} XP`
                : `${statusPatente.xpTotal} XP`}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${statusPatente.progressoPct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {statusPatente.proximaPatente
              ? `Faltam ${
                  statusPatente.xpNecessarioProximaPatente! - statusPatente.xpNaPatenteAtual
                } XP para ${statusPatente.proximaPatente.titulo}`
              : "Patente máxima atingida"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {PATENTES.map((p) => {
          const atingida = p.numero <= statusPatente.patente.numero;
          return (
            <span
              key={p.numero}
              title={`Patente ${p.numero}: ${p.titulo}`}
              className={`h-3 w-3 rounded-full ${
                atingida ? "bg-accent" : "border border-white/15 bg-white/5"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
