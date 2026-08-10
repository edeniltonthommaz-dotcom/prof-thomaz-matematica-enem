import { Dificuldade } from "@/lib/types";

const CONFIG: Record<Dificuldade, { label: string; classes: string }> = {
  facil: { label: "Fácil", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  medio: { label: "Médio", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  dificil: { label: "Difícil", classes: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

export default function DificuldadeBadge({ dificuldade }: { dificuldade: Dificuldade }) {
  const c = CONFIG[dificuldade];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.classes}`}>
      {c.label}
    </span>
  );
}

export const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};
