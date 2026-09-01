import { Rocket, Flame, Target, GraduationCap, type LucideIcon } from "lucide-react";
import type { GrupoConquista, StatusConquista } from "@/lib/gamificacao";

const ICONE_POR_GRUPO: Record<GrupoConquista, LucideIcon> = {
  inicio: Rocket,
  sequencia: Flame,
  acertos: Target,
  dominio: GraduationCap,
};

const TITULO_GRUPO: Record<GrupoConquista, string> = {
  inicio: "Primeiros passos",
  sequencia: "Sequência de estudos",
  acertos: "Total de acertos",
  dominio: "Domínio de assuntos",
};

const ORDEM_GRUPOS: GrupoConquista[] = ["inicio", "sequencia", "acertos", "dominio"];

export default function ConquistasGrid({ conquistas }: { conquistas: StatusConquista[] }) {
  return (
    <div className="space-y-6">
      {ORDEM_GRUPOS.map((grupo) => {
        const doGrupo = conquistas.filter((c) => c.grupo === grupo);
        if (doGrupo.length === 0) return null;
        const Icone = ICONE_POR_GRUPO[grupo];

        return (
          <div key={grupo}>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">{TITULO_GRUPO[grupo]}</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {doGrupo.map((c) => (
                <div
                  key={c.id}
                  title={c.descricao}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
                    c.desbloqueada
                      ? "border-accent/40 bg-accent/10"
                      : "border-white/10 bg-white/[0.02] opacity-60"
                  }`}
                >
                  <Icone
                    className={`h-5 w-5 shrink-0 ${c.desbloqueada ? "text-accent-soft" : "text-slate-500"}`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-xs font-semibold ${
                        c.desbloqueada ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {c.titulo}
                    </p>
                    {!c.desbloqueada && c.progresso && (
                      <p className="text-[11px] text-slate-500">
                        {c.progresso.atual} / {c.progresso.meta}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
