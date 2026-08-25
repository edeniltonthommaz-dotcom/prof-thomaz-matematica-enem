"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { BookOpen, Layers, ClipboardList, PlayCircle, type LucideIcon } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { resolverInfoQuestao, type MapaQuestoesCompacto } from "@/lib/mapaQuestoes";

interface Atalho {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  href: string;
}

function ultimaCategoriaRespondida(
  registros: ReturnType<typeof getSnapshot>,
  mapaQuestoes: MapaQuestoesCompacto
) {
  let melhorId: string | null = null;
  let melhorTimestamp = -Infinity;
  for (const [id, r] of Object.entries(registros)) {
    if (r?.respondida && r.timestamp > melhorTimestamp) {
      melhorId = id;
      melhorTimestamp = r.timestamp;
    }
  }
  return melhorId ? resolverInfoQuestao(mapaQuestoes, melhorId) : undefined;
}

export default function QuickAccessCards({ mapaQuestoes }: { mapaQuestoes: MapaQuestoesCompacto }) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ultimaCategoria = useMemo(
    () => ultimaCategoriaRespondida(registros, mapaQuestoes),
    [registros, mapaQuestoes]
  );

  const atalhos: Atalho[] = [
    { icon: BookOpen, titulo: "Assuntos", descricao: "Explore as 20 categorias do ENEM", href: "/assuntos" },
    { icon: Layers, titulo: "Flashcards", descricao: "Revise fórmulas e conceitos", href: "/flashcards" },
    {
      icon: ClipboardList,
      titulo: "Simulado",
      descricao: "Questões variadas entre todos os assuntos",
      href: "/simulados",
    },
    ...(ultimaCategoria
      ? [
          {
            icon: PlayCircle,
            titulo: "Continuar último conteúdo",
            descricao: ultimaCategoria.categoriaNome,
            href: `/assuntos/${ultimaCategoria.categoriaId}`,
          },
        ]
      : []),
  ];

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-white">Acesso rápido</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {atalhos.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.titulo}
              href={a.href}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-white">{a.titulo}</p>
                <p className="text-xs text-slate-400">{a.descricao}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
