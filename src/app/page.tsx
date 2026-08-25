import { categorias } from "@/data/categorias";
import { questoesPorCategoria } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/DashboardHeader";
import PatenteCard from "@/components/PatenteCard";
import MetaDiariaCard from "@/components/MetaDiariaCard";
import ProgressoGeralCard from "@/components/ProgressoGeralCard";
import MetricsCarousel from "@/components/MetricsCarousel";
import QuickAccessCards from "@/components/QuickAccessCards";
import AtividadeHeatmap from "@/components/AtividadeHeatmap";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categoriasComQuestoes = categorias.map((c) => ({
    categoria: c,
    questaoIds: questoesPorCategoria(c.id).map((q) => q.id),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <DashboardHeader user={user} />
      <PatenteCard />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <MetaDiariaCard categorias={categoriasComQuestoes} />
        <ProgressoGeralCard categorias={categoriasComQuestoes} />
      </div>
      <MetricsCarousel categorias={categoriasComQuestoes} />
      <QuickAccessCards categorias={categoriasComQuestoes} />
      <AtividadeHeatmap />
    </div>
  );
}
