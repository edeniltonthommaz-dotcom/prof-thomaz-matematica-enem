import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nome = (searchParams.get("nome") ?? "Visitante").slice(0, 60);
  const respondidas = searchParams.get("respondidas") ?? "0";
  const pct = searchParams.get("pct") ?? "0";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #1f2937 0%, #0b1120 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: 24,
          }}
        >
          Prof. Thomaz · Matemática ENEM
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 32,
          }}
        >
          {nome}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 800, color: "#22d3ee" }}>
            {pct}%
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#cbd5e1" }}>
            de acerto em {respondidas} questões
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
