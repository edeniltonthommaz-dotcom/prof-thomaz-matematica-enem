import { selecionarSimulado } from "@/lib/simulado";
import { getCategoria } from "@/data/categorias";
import SimuladoPlayer from "@/components/SimuladoPlayer";

export const dynamic = "force-dynamic";

export default function SimuladosPage() {
  const questoes = selecionarSimulado().map((q) => ({
    ...q,
    categoriaNome: getCategoria(q.categoriaId)?.nome ?? q.categoriaId,
  }));
  const simuladoId = questoes.map((q) => q.id).join("-");

  return <SimuladoPlayer key={simuladoId} questoes={questoes} />;
}
