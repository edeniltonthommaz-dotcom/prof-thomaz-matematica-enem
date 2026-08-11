import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Início" },
  { href: "/assuntos", label: "Assuntos" },
  { href: "/dificuldade", label: "Dificuldade" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1120]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo/thomaz-branca.png"
            alt="Thomaz"
            width={394}
            height={319}
            className="h-10 w-auto"
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
        <nav className="flex gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
