import { redirect } from "next/navigation";
import { todasQuestoes } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default function AleatoriaPage() {
  const questao = todasQuestoes[Math.floor(Math.random() * todasQuestoes.length)];
  redirect(`/assuntos/${questao.categoriaId}/${questao.id}`);
}
