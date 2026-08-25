"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AuthButton from "@/components/AuthButton";
import { Logo, NavLinks } from "@/components/Sidebar";

export default function MobileSidebar({
  aberto,
  onFechar,
  user,
  pathname,
}: {
  aberto: boolean;
  onFechar: () => void;
  user: User | null;
  pathname: string;
}) {
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onFechar}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="relative flex h-full w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-white/10 bg-[#0b1120] px-4 py-6"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onFechar}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks pathname={pathname} onNavigate={onFechar} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <AuthButton initialUser={user} />
        </div>
      </aside>
    </div>
  );
}
