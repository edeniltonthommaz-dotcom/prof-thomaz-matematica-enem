"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import { diasAtivos, calcularSequencia } from "@/lib/gamificacao";

export default function DashboardHeader({ user }: { user: User | null }) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sequencia = useMemo(() => calcularSequencia(diasAtivos(registros)), [registros]);

  const nome: string =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "Visitante";
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;
  const primeiroNome = nome.split(" ")[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {primeiroNome}!</h1>
        <p className="text-sm text-slate-400">Vamos avançar mais um pouco hoje?</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
          title={`${sequencia.atual} ${sequencia.atual === 1 ? "dia seguido" : "dias seguidos"}`}
        >
          <Flame className={`h-3.5 w-3.5 ${sequencia.atual > 0 ? "text-amber-400" : "text-slate-500"}`} />
          {sequencia.atual}
        </span>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={nome} width={36} height={36} className="h-9 w-9 rounded-full" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600/20 text-sm font-semibold text-gray-200">
            {primeiroNome.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
