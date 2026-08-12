import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Chamada pelo Vercel Cron (ver vercel.json) para gerar atividade periódica
 * no projeto Supabase e evitar a pausa automática por inatividade (~7 dias
 * sem requisições no plano free).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from("progresso_questoes")
    .select("id", { head: true, count: "exact" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
