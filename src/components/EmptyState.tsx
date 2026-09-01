import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  acao,
}: {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  acao?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-400">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mb-1 text-lg font-semibold text-white">{titulo}</h2>
      <p className="max-w-sm text-sm text-slate-400">{descricao}</p>
      {acao && (
        <Link
          href={acao.href}
          className="btn-primary mt-6"
        >
          {acao.label}
        </Link>
      )}
    </div>
  );
}
