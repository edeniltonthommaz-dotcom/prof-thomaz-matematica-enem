import { createClient } from "@/lib/supabase/server";
import { categorias } from "@/data/categorias";
import { todasQuestoes, questoesPorCategoria } from "@/lib/questions";
import DesempenhoView from "@/components/DesempenhoView";

export default async function DesempenhoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nome =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    null;

  const categoriasComQuestoes = categorias.map((c) => ({
    categoria: c,
    questaoIds: questoesPorCategoria(c.id).map((q) => q.id),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Meu Desempenho</h1>
      <DesempenhoView
        nome={nome}
        questaoIdsGlobal={todasQuestoes.map((q) => q.id)}
        categorias={categoriasComQuestoes}
      />
    </div>
  );
}
