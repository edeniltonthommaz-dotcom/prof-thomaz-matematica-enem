import Link from "next/link";
import { categorias } from "@/data/categorias";
import { contagemPorDificuldade } from "@/lib/questions";
import DificuldadeBadge from "@/components/DificuldadeBadge";
import { Dificuldade } from "@/lib/types";

export const metadata = { title: "Questões por Dificuldade — Banco ENEM" };

const NIVEIS: Dificuldade[] = ["facil", "medio", "dificil"];

export default function DificuldadePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-white">Questões por Dificuldade</h1>
      <p className="mb-10 max-w-2xl text-slate-400">
        Filtre por Fácil, Médio ou Difícil para consolidar sua base sem tropeços.
      </p>

      <div className="flex flex-col gap-10">
        {NIVEIS.map((nivel) => (
          <section key={nivel}>
            <div className="mb-4 flex items-center gap-3">
              <DificuldadeBadge dificuldade={nivel} />
              <h2 className="text-xl font-semibold text-white">
                {nivel === "facil" ? "Fácil" : nivel === "medio" ? "Médio" : "Difícil"}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categorias.map((c) => {
                const count = contagemPorDificuldade(c.id)[nivel];
                return (
                  <Link
                    key={c.id}
                    href={`/assuntos/${c.id}?dif=${nivel}`}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06]"
                  >
                    <span className="text-sm text-slate-200">{c.nome}</span>
                    <span className="text-xs text-slate-400">{count} questões</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
