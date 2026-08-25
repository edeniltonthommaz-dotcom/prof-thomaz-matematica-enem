"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Home,
  Target,
  BookOpen,
  Gauge,
  ClipboardList,
  Layers,
  RotateCcw,
  Star,
  BarChart3,
  Menu,
  type LucideIcon,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";
import MobileSidebar from "@/components/MobileSidebar";

interface ItemNav {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: ItemNav[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/#meta-diaria", label: "Meta Diária", icon: Target },
  { href: "/assuntos", label: "Assuntos", icon: BookOpen },
  { href: "/dificuldade", label: "Dificuldade", icon: Gauge },
  { href: "/simulados", label: "Simulados", icon: ClipboardList },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/revisao", label: "Revisão", icon: RotateCcw },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/desempenho", label: "Meu Desempenho", icon: BarChart3 },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <Image
        src="/logo/thomaz-branca.png"
        alt="Thomaz"
        width={394}
        height={319}
        className="h-9 w-auto"
        priority
      />
      <span className="block leading-tight">
        <span className="block text-sm font-semibold text-white">Prof. Thomaz</span>
        <span className="block text-[11px] text-slate-400">
          Matemática ENEM
          <br />
          1000+ questões
        </span>
      </span>
    </Link>
  );
}

export function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" onClick={onNavigate}>
      {NAV_ITEMS.map((item) => {
        const ativo = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              ativo ? "bg-white/[0.06] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${ativo ? "text-gray-200" : "text-slate-400"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0b1120]/95 px-4 py-3 backdrop-blur sticky top-0 z-10 lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <MobileSidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} user={user} pathname={pathname} />

      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64 lg:shrink-0 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:border-r lg:border-white/10 lg:bg-[#0b1120] lg:px-4 lg:py-6">
        <Logo />
        <NavLinks pathname={pathname} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <AuthButton initialUser={user} />
        </div>
      </aside>
    </>
  );
}
