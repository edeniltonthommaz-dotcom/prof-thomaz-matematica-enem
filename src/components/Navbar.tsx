import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/assuntos", label: "Assuntos" },
  { href: "/dificuldade", label: "Dificuldade" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1120]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            E
          </span>
          <span>
            <span className="block text-sm font-bold leading-none text-white">
              Banco ENEM
            </span>
            <span className="block text-[11px] leading-tight text-slate-400">
              Matemática • 1000+ questões
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
