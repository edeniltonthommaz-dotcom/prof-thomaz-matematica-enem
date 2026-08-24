"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot, alternarFavorito } from "@/lib/favoritos";
import { resolverInfoQuestao, type MapaQuestoesCompacto, type InfoQuestao } from "@/lib/mapaQuestoes";
import EmptyState from "@/components/EmptyState";

export default function FavoritosList({
  mapaQuestoes,
}: {
  mapaQuestoes: MapaQuestoesCompacto;
}) {
  const favoritos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const itens = useMemo(
    () =>
      Object.keys(favoritos)
        .map((id) => ({ id, info: resolverInfoQuestao(mapaQuestoes, id) }))
        .filter((i): i is { id: string; info: InfoQuestao } => !!i.info),
    [favoritos, mapaQuestoes]
  );

  if (itens.length === 0) {
    return (
      <EmptyState
        icon={Star}
        titulo="Nenhuma questão favoritada"
        descricao="Clique na estrela ao responder uma questão para salvá-la aqui e achar rápido depois."
        acao={{ href: "/assuntos", label: "Explorar assuntos" }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {itens.map(({ id, info }) => (
        <div
          key={id}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{info.categoriaNome}</p>
            <p className="truncate text-xs text-slate-400">{info.subtopico}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/assuntos/${info.categoriaId}/${id}`}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
            >
              Abrir
            </Link>
            <button
              type="button"
              onClick={() => alternarFavorito(id)}
              aria-label="Remover dos favoritos"
              className="text-amber-400"
            >
              <Star className="h-4 w-4 fill-amber-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
