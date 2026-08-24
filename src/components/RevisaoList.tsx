"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { resolverInfoQuestao, type MapaQuestoesCompacto, type InfoQuestao } from "@/lib/mapaQuestoes";
import EmptyState from "@/components/EmptyState";

export default function RevisaoList({
  mapaQuestoes,
}: {
  mapaQuestoes: MapaQuestoesCompacto;
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const itens = useMemo(
    () =>
      Object.entries(registros)
        .filter(([, r]) => r?.respondida && !r.correta)
        .map(([id, r]) => ({ id, info: resolverInfoQuestao(mapaQuestoes, id), timestamp: r.timestamp }))
        .filter((i): i is { id: string; info: InfoQuestao; timestamp: number } => !!i.info)
        .sort((a, b) => b.timestamp - a.timestamp),
    [registros, mapaQuestoes]
  );

  if (itens.length === 0) {
    return (
      <EmptyState
        icon={RotateCcw}
        titulo="Nenhum erro registrado ainda"
        descricao="As questões que você errar aparecem aqui para você revisar rapidamente."
        acao={{ href: "/assuntos", label: "Explorar assuntos" }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {itens.map(({ id, info }) => (
        <Link
          key={id}
          href={`/assuntos/${info.categoriaId}/${id}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-gray-400"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{info.categoriaNome}</p>
            <p className="truncate text-xs text-slate-400">{info.subtopico}</p>
          </div>
          <span className="shrink-0 text-xs text-slate-400">Revisar →</span>
        </Link>
      ))}
    </div>
  );
}
