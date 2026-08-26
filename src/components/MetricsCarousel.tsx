"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2, XCircle, Percent, Flame, Target, CalendarCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { calcularSequencia, diasAtivos, calcularProgressoMetaSemanal } from "@/lib/gamificacao";
import {
  subscribe as subscribeMeta,
  getSnapshot as getMetaSnapshot,
  getServerSnapshot as getMetaServerSnapshot,
} from "@/lib/metaDiaria";
import type { Categoria } from "@/lib/types";

interface Indicador {
  icon: LucideIcon;
  valor: string;
  label: string;
}

export default function MetricsCarousel({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const metaDiaria = useSyncExternalStore(subscribeMeta, getMetaSnapshot, getMetaServerSnapshot);
  const questaoIds = useMemo(() => categorias.flatMap((c) => c.questaoIds), [categorias]);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);
  const sequencia = useMemo(() => calcularSequencia(diasAtivos(registros)), [registros]);
  const metaSemanal = useMemo(
    () => calcularProgressoMetaSemanal(registros, metaDiaria),
    [registros, metaDiaria]
  );

  const indicadores: Indicador[] = [
    { icon: CheckCircle2, valor: stats.respondidas.toLocaleString("pt-BR"), label: "Questões respondidas" },
    { icon: Target, valor: stats.acertos.toLocaleString("pt-BR"), label: "Acertos" },
    { icon: XCircle, valor: (stats.respondidas - stats.acertos).toLocaleString("pt-BR"), label: "Erros" },
    { icon: Percent, valor: stats.acertoPct !== null ? `${stats.acertoPct}%` : "—", label: "Taxa de acerto" },
    { icon: Flame, valor: `${sequencia.atual}`, label: sequencia.atual === 1 ? "dia seguido" : "dias seguidos" },
    { icon: CalendarCheck, valor: `${metaSemanal.atual}/${metaSemanal.meta}`, label: "Meta semanal" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  function aoRolar() {
    const el = scrollRef.current;
    if (!el || el.children.length < 2) return;
    const primeiro = el.children[0] as HTMLElement;
    const segundo = el.children[1] as HTMLElement;
    const passo = segundo.offsetLeft - primeiro.offsetLeft;
    if (passo <= 0) return;
    const indice = Math.round((el.scrollLeft + el.clientWidth / 2 - primeiro.offsetWidth / 2) / passo);
    setIndiceAtivo(Math.max(0, Math.min(indicadores.length - 1, indice)));
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={aoRolar}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 max-sm:grid-cols-none max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:[scrollbar-width:none]"
      >
        {indicadores.map((ind) => {
          const Icon = ind.icon;
          return (
            <div
              key={ind.label}
              className="max-sm:w-[85vw] max-sm:shrink-0 max-sm:snap-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <Icon className="mb-2 h-4 w-4 text-gray-400" />
              <p className="text-2xl font-bold text-white">{ind.valor}</p>
              <p className="text-xs text-slate-400">{ind.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {indicadores.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === indiceAtivo ? "bg-gray-400" : "bg-white/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
