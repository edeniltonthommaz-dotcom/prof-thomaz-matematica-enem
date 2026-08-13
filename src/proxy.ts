import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas acessíveis sem login. /desempenho/compartilhar e /api/og-resultado
// precisam ficar públicas de propósito: são a página/imagem que qualquer
// pessoa (sem conta) vê ao abrir um link compartilhado nas redes sociais.
// /api/keep-alive tem seu próprio segredo (CRON_SECRET), não usa sessão de usuário.
const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  "/api/keep-alive",
  "/api/og-resultado",
  "/desempenho/compartilhar",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Não remover: é essa chamada que dispara o refresh do token de sessão.
  // Sem ela, sessões expiram silenciosamente mesmo com cookie presente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname + search);

    const redirectResponse = NextResponse.redirect(loginUrl);
    // preserva qualquer cookie de sessão recém-atualizado pelo getUser() acima
    supabaseResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
