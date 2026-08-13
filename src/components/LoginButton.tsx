"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton({ next }: { next: string }) {
  async function entrar() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <button
      onClick={entrar}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
    >
      Entrar com Google
    </button>
  );
}
