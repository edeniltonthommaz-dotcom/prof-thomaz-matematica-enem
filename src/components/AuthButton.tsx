"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hydrateFromSupabase, resetToGuest } from "@/lib/progress";

export default function AuthButton({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // reidrata a cada carregamento de página (o cache em memória de progress.ts
    // é perdido em um refresh completo, mesmo com a sessão do Supabase ainda válida)
    if (initialUser) {
      hydrateFromSupabase(initialUser.id);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        hydrateFromSupabase(session.user.id);
      } else if (event === "SIGNED_OUT") {
        resetToGuest();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só na montagem; initialUser.id é usado apenas para a hidratação inicial
  }, []);

  async function entrar() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname)}`,
      },
    });
  }

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <button
        onClick={entrar}
        className="ml-auto flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
      >
        Entrar com Google
      </button>
    );
  }

  const nome = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Você";
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url;

  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={nome}
          width={28}
          height={28}
          className="h-7 w-7 rounded-full"
        />
      ) : null}
      <span className="max-w-[10rem] truncate text-slate-200">{nome}</span>
      <button
        onClick={sair}
        className="rounded-md px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-white"
      >
        Sair
      </button>
    </div>
  );
}
