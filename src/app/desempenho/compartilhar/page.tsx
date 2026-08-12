import type { Metadata } from "next";
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

function primeiro(v: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(v)) return v[0] ?? fallback;
  return v ?? fallback;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const nome = primeiro(sp.nome, "Visitante");
  const respondidas = primeiro(sp.respondidas, "0");
  const pct = primeiro(sp.pct, "0");

  const query = new URLSearchParams({ nome, respondidas, pct }).toString();
  const titulo = `${nome} acertou ${pct}% em Matemática ENEM`;
  const descricao = `${respondidas} questões respondidas · Prof. Thomaz — Matemática ENEM`;
  const imagem = `/api/og-resultado?${query}`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      images: [{ url: imagem, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  };
}

export default async function CompartilharPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const nome = primeiro(sp.nome, "Visitante");
  const respondidas = primeiro(sp.respondidas, "0");
  const pct = primeiro(sp.pct, "0");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-sm text-slate-400">Prof. Thomaz · Matemática ENEM</p>
      <h1 className="mt-2 text-3xl font-bold text-white">
        {nome} acertou {pct}% em {respondidas} questões
      </h1>
      <p className="mt-4 text-slate-400">
        Pratique matemática do ENEM com questões organizadas por assunto e dificuldade.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
      >
        Praticar também →
      </Link>
    </div>
  );
}
