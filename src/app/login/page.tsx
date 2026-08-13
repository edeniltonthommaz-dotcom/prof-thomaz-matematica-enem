import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sp = await searchParams;
  const nextParam = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const destino = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  if (user) {
    redirect(destino);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-bold text-white">Prof. Thomaz — Matemática ENEM</h1>
      <p className="mb-8 text-slate-400">
        Entre com sua conta Google para praticar e acompanhar seu desempenho.
      </p>
      <LoginButton next={destino} />
    </div>
  );
}
