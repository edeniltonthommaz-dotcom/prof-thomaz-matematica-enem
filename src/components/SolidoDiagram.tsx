import { DiagramaSolido } from "@/lib/types";

const VB_W = 340;
const VB_H = 260;
const PAD = 30;
const AREA_W = VB_W - PAD * 2;
const AREA_H = VB_H - PAD * 2;

const STROKE = "#8a93a6";
const STROKE_SOFT = "#5b6577";
const LABEL = "#cbd5e1";
const FILL = "#22c9dd";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Centraliza um desenho de largura/altura conhecidas dentro da área útil do viewBox. */
function centerOffset(w: number, h: number) {
  return { ox: PAD + (AREA_W - w) / 2, oy: PAD + (AREA_H - h) / 2 };
}

function DimLabel({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} fill={LABEL} fontSize={12} textAnchor="middle" fontFamily="system-ui, sans-serif">
      {children}
    </text>
  );
}

function Paralelepipedo({ comprimento, largura, altura, unidade }: { comprimento: number; largura: number; altura: number; unidade: string }) {
  const maior = Math.max(comprimento, largura, altura);
  const scale = 150 / maior;
  const w = clamp(comprimento * scale, 40, 190);
  const depthUnits = clamp(largura * scale, 28, 110);
  const h = clamp(altura * scale, 40, 150);
  const dx = depthUnits * 0.55;
  const dy = -depthUnits * 0.4;

  const totalW = w + dx;
  const totalH = h + Math.abs(dy);
  const { ox, oy } = centerOffset(totalW, totalH);
  const x0 = ox;
  const y0 = oy + totalH;

  const FBL = [x0, y0];
  const FBR = [x0 + w, y0];
  const FTR = [x0 + w, y0 - h];
  const FTL = [x0, y0 - h];
  const BBR = [x0 + w + dx, y0 + dy];
  const BTR = [x0 + w + dx, y0 - h + dy];
  const BTL = [x0 + dx, y0 - h + dy];

  const pts = (arr: number[][]) => arr.map((p) => p.join(",")).join(" ");

  return (
    <g>
      <polygon points={pts([FBR, FTR, BTR, BBR])} fill={FILL} fillOpacity={0.14} stroke={STROKE} strokeWidth={1.5} />
      <polygon points={pts([FTL, FTR, BTR, BTL])} fill={FILL} fillOpacity={0.3} stroke={STROKE} strokeWidth={1.5} />
      <polygon points={pts([FBL, FBR, FTR, FTL])} fill={FILL} fillOpacity={0.22} stroke={STROKE} strokeWidth={1.5} />

      <line x1={x0} y1={y0 + 14} x2={x0 + w} y2={y0 + 14} stroke={STROKE_SOFT} strokeWidth={1} />
      <DimLabel x={x0 + w / 2} y={y0 + 27}>
        {comprimento} {unidade}
      </DimLabel>

      <line x1={x0 - 14} y1={y0} x2={x0 - 14} y2={y0 - h} stroke={STROKE_SOFT} strokeWidth={1} />
      <text
        x={x0 - 22}
        y={y0 - h / 2}
        fill={LABEL}
        fontSize={12}
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        transform={`rotate(-90, ${x0 - 22}, ${y0 - h / 2})`}
      >
        {altura} {unidade}
      </text>

      <DimLabel x={BTR[0] + 4} y={BTR[1] - 6}>
        {largura} {unidade}
      </DimLabel>
    </g>
  );
}

function Cilindro({ raio, altura, unidade }: { raio: number; altura: number; unidade: string }) {
  const maior = Math.max(raio * 2, altura);
  const scale = 150 / maior;
  const rx = clamp(raio * scale, 30, 110);
  const ry = rx * 0.38;
  const h = clamp(altura * scale, 40, 160);

  const totalW = rx * 2;
  const totalH = h + ry * 2;
  const { ox, oy } = centerOffset(totalW, totalH);
  const cx = ox + rx;
  const cyTop = oy + ry;
  const cyBottom = cyTop + h;

  const bodyPath = `M ${cx - rx} ${cyTop} L ${cx - rx} ${cyBottom} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cyBottom} L ${cx + rx} ${cyTop}`;

  return (
    <g>
      <path d={bodyPath} fill={FILL} fillOpacity={0.2} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <ellipse cx={cx} cy={cyTop} rx={rx} ry={ry} fill={FILL} fillOpacity={0.3} stroke={STROKE} strokeWidth={1.5} />

      <line x1={cx} y1={cyTop} x2={cx + rx} y2={cyTop} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <DimLabel x={cx + rx / 2} y={cyTop - 7}>
        r = {raio} {unidade}
      </DimLabel>

      <line x1={cx + rx + 14} y1={cyTop} x2={cx + rx + 14} y2={cyBottom} stroke={STROKE_SOFT} strokeWidth={1} />
      <text
        x={cx + rx + 26}
        y={cyTop + h / 2}
        fill={LABEL}
        fontSize={12}
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        transform={`rotate(-90, ${cx + rx + 26}, ${cyTop + h / 2})`}
      >
        {altura} {unidade}
      </text>
    </g>
  );
}

function Cone({ raio, altura, unidade }: { raio: number; altura: number; unidade: string }) {
  const maior = Math.max(raio * 2, altura);
  const scale = 150 / maior;
  const rx = clamp(raio * scale, 30, 110);
  const ry = rx * 0.38;
  const h = clamp(altura * scale, 50, 170);

  const totalW = rx * 2;
  const totalH = h + ry;
  const { ox, oy } = centerOffset(totalW, totalH);
  const cx = ox + rx;
  const cyBase = oy + totalH;
  const cyApex = cyBase - h;

  const bodyPath = `M ${cx - rx} ${cyBase} L ${cx} ${cyApex} L ${cx + rx} ${cyBase} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cyBase}`;

  return (
    <g>
      <path d={bodyPath} fill={FILL} fillOpacity={0.22} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <ellipse cx={cx} cy={cyBase} rx={rx} ry={ry} fill="none" stroke={STROKE} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />

      <line x1={cx} y1={cyBase} x2={cx + rx} y2={cyBase} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <DimLabel x={cx + rx / 2} y={cyBase + 16}>
        r = {raio} {unidade}
      </DimLabel>

      <line x1={cx} y1={cyApex} x2={cx} y2={cyBase} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <DimLabel x={cx + 34} y={cyApex + h / 2}>
        h = {altura} {unidade}
      </DimLabel>
    </g>
  );
}

function Piramide({ ladoBase, altura, unidade }: { ladoBase: number; altura: number; unidade: string }) {
  const maior = Math.max(ladoBase, altura);
  const scale = 140 / maior;
  const rx = clamp((ladoBase * scale) / 2, 30, 100);
  const ry = rx * 0.42;
  const h = clamp(altura * scale, 50, 170);

  const totalW = rx * 2;
  const totalH = h + ry;
  const { ox, oy } = centerOffset(totalW, totalH);
  const cx = ox + rx;
  const cyBase = oy + totalH - ry / 2;
  const apex = [cx, cyBase - h];
  const front = [cx, cyBase + ry];
  const back = [cx, cyBase - ry];
  const left = [cx - rx, cyBase];
  const right = [cx + rx, cyBase];

  return (
    <g>
      <polygon points={`${apex.join(",")} ${front.join(",")} ${left.join(",")}`} fill={FILL} fillOpacity={0.22} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <polygon points={`${apex.join(",")} ${front.join(",")} ${right.join(",")}`} fill={FILL} fillOpacity={0.3} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1={back[0]} y1={back[1]} x2={left[0]} y2={left[1]} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={back[0]} y1={back[1]} x2={right[0]} y2={right[1]} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={apex[0]} y1={apex[1]} x2={back[0]} y2={back[1]} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />

      <line x1={left[0]} y1={left[1] + 14} x2={front[0]} y2={front[1] + 4} stroke={STROKE_SOFT} strokeWidth={1} />
      <DimLabel x={cx - rx / 3} y={front[1] + 24}>
        lado = {ladoBase} {unidade}
      </DimLabel>

      <line x1={apex[0] - 16} y1={apex[1]} x2={apex[0] - 16} y2={cyBase} stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />
      <text
        x={apex[0] - 28}
        y={apex[1] + h / 2}
        fill={LABEL}
        fontSize={12}
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        transform={`rotate(-90, ${apex[0] - 28}, ${apex[1] + h / 2})`}
      >
        h = {altura} {unidade}
      </text>
    </g>
  );
}

function Esfera({ raio, unidade }: { raio: number; unidade: string }) {
  const r = clamp(raio * 12, 50, 110);
  const { ox, oy } = centerOffset(r * 2, r * 2);
  const cx = ox + r;
  const cy = oy + r;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={FILL} fillOpacity={0.18} stroke={STROKE} strokeWidth={1.5} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="none" stroke={STROKE_SOFT} strokeWidth={1} strokeDasharray="3 2" />

      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={STROKE_SOFT} strokeWidth={1} />
      <DimLabel x={cx + r / 2} y={cy - 8}>
        r = {raio} {unidade}
      </DimLabel>
    </g>
  );
}

function PlanificacaoCaixa({ comprimento, largura, altura, unidade }: { comprimento: number; largura: number; altura: number; unidade: string }) {
  const totalUnitsW = 2 * comprimento + 2 * largura;
  const totalUnitsH = 2 * largura + altura;
  const scale = Math.min(AREA_W / totalUnitsW, AREA_H / totalUnitsH, 14);
  const C = comprimento * scale;
  const L = largura * scale;
  const A = altura * scale;

  const totalW = 2 * C + 2 * L;
  const totalH = 2 * L + A;
  const { ox, oy } = centerOffset(totalW, totalH);

  const xLeft = ox;
  const xFront = xLeft + L;
  const xRight = xFront + C;
  const xBack = xRight + L;
  const yMid = oy + L;

  const face = (x: number, y: number, w: number, hh: number, key: string) => (
    <rect key={key} x={x} y={y} width={w} height={hh} fill={FILL} fillOpacity={0.16} stroke={STROKE} strokeWidth={1.3} />
  );

  return (
    <g>
      {face(xLeft, yMid, L, A, "left")}
      {face(xFront, yMid, C, A, "front")}
      {face(xRight, yMid, L, A, "right")}
      {face(xBack, yMid, C, A, "back")}
      {face(xFront, oy, C, L, "top")}
      {face(xFront, yMid + A, C, L, "bottom")}

      <DimLabel x={xFront + C / 2} y={yMid + A + 16}>
        {comprimento} {unidade}
      </DimLabel>
      <DimLabel x={xLeft - 4 + L / 2} y={yMid - 6}>
        {largura} {unidade}
      </DimLabel>
      <text
        x={xFront - 12}
        y={yMid + A / 2}
        fill={LABEL}
        fontSize={11}
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        transform={`rotate(-90, ${xFront - 12}, ${yMid + A / 2})`}
      >
        {altura} {unidade}
      </text>
    </g>
  );
}

export default function SolidoDiagram({ diagrama }: { diagrama: DiagramaSolido }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Diagrama do sólido geométrico">
      {diagrama.tipo === "paralelepipedo" && <Paralelepipedo {...diagrama} />}
      {diagrama.tipo === "cilindro" && <Cilindro {...diagrama} />}
      {diagrama.tipo === "cone" && <Cone {...diagrama} />}
      {diagrama.tipo === "piramide" && <Piramide {...diagrama} />}
      {diagrama.tipo === "esfera" && <Esfera {...diagrama} />}
      {diagrama.tipo === "planificacao-caixa" && <PlanificacaoCaixa {...diagrama} />}
    </svg>
  );
}
