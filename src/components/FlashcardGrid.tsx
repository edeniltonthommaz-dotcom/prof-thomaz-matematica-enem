"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";

export default function FlashcardGrid({
  grupos,
}: {
  grupos: { categoriaId: string; categoriaNome: string; cards: Flashcard[] }[];
}) {
  const [virados, setVirados] = useState<Record<string, boolean>>({});

  function alternar(id: string) {
    setVirados((v) => ({ ...v, [id]: !v[id] }));
  }

  return (
    <div className="space-y-8">
      {grupos.map((grupo) => (
        <div key={grupo.categoriaId}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {grupo.categoriaNome}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grupo.cards.map((card) => {
              const virado = !!virados[card.id];
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => alternar(card.id)}
                  aria-label={virado ? "Ver pergunta" : "Ver fórmula"}
                  className={`flex min-h-[9rem] flex-col justify-between rounded-xl border p-4 text-left transition ${
                    virado
                      ? "border-gray-400/40 bg-gray-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {card.subtopico}
                    </p>
                    <p className={`text-sm ${virado ? "font-mono text-base text-gray-200" : "text-slate-100"}`}>
                      {virado ? card.verso : card.frente}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">
                    {virado ? "Clique para ver a pergunta" : "Clique para ver a fórmula"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
