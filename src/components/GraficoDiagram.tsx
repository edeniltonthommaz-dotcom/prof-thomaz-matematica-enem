import { DiagramaGrafico } from "@/lib/types";

const CATEGORICAL = ["#22c9dd", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];
const MUTED = "#94a3b8";
const AXIS = "rgba(255,255,255,0.22)";
const GRID = "rgba(255,255,255,0.08)";
const VALUE_INK = "#eef3f9";

function roundedTopBarPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M ${x} ${y + h} L ${x} ${y + rr} Q ${x} ${y} ${x + rr} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h} Z`;
}

function BarChart({ titulo, eixoY, categorias, valores }: { titulo?: string; eixoY?: string; categorias: string[]; valores: number[] }) {
  const W = 460;
  const H = 280;
  const padLeft = 44;
  const padRight = 20;
  const padTop = titulo ? 40 : 20;
  const padBottom = 46;
  const areaW = W - padLeft - padRight;
  const areaH = H - padTop - padBottom;

  const max = Math.max(...valores);
  const niceMax = Math.ceil((max * 1.2) / 4) * 4 || 4;
  const baselineY = padTop + areaH;

  const n = categorias.length;
  const slot = areaW / n;
  const barW = Math.min(24, slot * 0.5);

  const gridLines = [0, 1, 2, 3, 4].map((i) => {
    const v = Math.round((niceMax * i) / 4);
    const y = baselineY - (v / niceMax) * areaH;
    return { v, y };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-lg" role="img" aria-label={titulo ?? "Gráfico de barras"}>
      {titulo && (
        <text x={W / 2} y={22} fill={VALUE_INK} fontSize={13} fontWeight={600} textAnchor="middle" fontFamily="system-ui, sans-serif">
          {titulo}
        </text>
      )}

      {gridLines.map((g) => (
        <g key={g.v}>
          <line x1={padLeft} y1={g.y} x2={W - padRight} y2={g.y} stroke={g.v === 0 ? AXIS : GRID} strokeWidth={1} />
          <text x={padLeft - 8} y={g.y + 4} fill={MUTED} fontSize={10} textAnchor="end" fontFamily="system-ui, sans-serif">
            {g.v.toLocaleString("pt-BR")}
          </text>
        </g>
      ))}

      {eixoY && (
        <text
          x={14}
          y={padTop + areaH / 2}
          fill={MUTED}
          fontSize={10}
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          transform={`rotate(-90, 14, ${padTop + areaH / 2})`}
        >
          {eixoY}
        </text>
      )}

      {categorias.map((cat, i) => {
        const v = valores[i];
        const h = niceMax === 0 ? 0 : (v / niceMax) * areaH;
        const x = padLeft + slot * i + (slot - barW) / 2;
        const y = baselineY - h;
        return (
          <g key={cat + i}>
            <path d={roundedTopBarPath(x, y, barW, h, 4)} fill={CATEGORICAL[0]} />
            <text x={x + barW / 2} y={y - 6} fill={VALUE_INK} fontSize={11} fontWeight={600} textAnchor="middle" fontFamily="system-ui, sans-serif">
              {v.toLocaleString("pt-BR")}
            </text>
            <text x={x + barW / 2} y={baselineY + 18} fill={MUTED} fontSize={11} textAnchor="middle" fontFamily="system-ui, sans-serif">
              {cat}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function PieChart({ titulo, categorias, valores }: { titulo?: string; categorias: string[]; valores: number[] }) {
  const W = 460;
  const H = 280;
  const cx = 150;
  const cy = titulo ? 150 : 140;
  const r = 95;

  const total = valores.reduce((a, b) => a + b, 0) || 1;
  const slices = valores.map((v, i) => {
    const before = valores.slice(0, i).reduce((a, b) => a + b, 0);
    const startAngle = (before / total) * 360;
    const endAngle = ((before + v) / total) * 360;
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    const midAngle = (startAngle + endAngle) / 2;
    const pct = (v / total) * 100;
    const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);
    return { path, color: CATEGORICAL[i % CATEGORICAL.length], pct, labelPos, cat: categorias[i], v, span: endAngle - startAngle };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-lg" role="img" aria-label={titulo ?? "Gráfico de pizza"}>
      {titulo && (
        <text x={W / 2} y={22} fill={VALUE_INK} fontSize={13} fontWeight={600} textAnchor="middle" fontFamily="system-ui, sans-serif">
          {titulo}
        </text>
      )}

      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="#070b12" strokeWidth={2} />
      ))}

      {slices.map(
        (s, i) =>
          s.span >= 25 && (
            <text
              key={"label" + i}
              x={s.labelPos.x}
              y={s.labelPos.y}
              fill="#070b12"
              fontSize={11}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
            >
              {Math.round(s.pct)}%
            </text>
          )
      )}

      <g transform={`translate(270, ${cy - slices.length * 11})`}>
        {slices.map((s, i) => (
          <g key={"legend" + i} transform={`translate(0, ${i * 22})`}>
            <rect width={12} height={12} rx={2} fill={s.color} />
            <text x={18} y={10} fill={VALUE_INK} fontSize={11} fontFamily="system-ui, sans-serif">
              {s.cat} ({Math.round(s.pct)}%)
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function GraficoDiagram({ diagrama }: { diagrama: DiagramaGrafico }) {
  if (diagrama.tipo === "barras") return <BarChart {...diagrama} />;
  return <PieChart {...diagrama} />;
}
