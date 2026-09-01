export default function CircularProgress({
  pct,
  size = 140,
  strokeWidth = 12,
  label,
  corDestaque = "verde",
}: {
  pct: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  corDestaque?: "verde" | "amarelo";
}) {
  const pctClamped = Math.max(0, Math.min(100, pct));
  const raio = (size - strokeWidth) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia * (1 - pctClamped / 100);
  const corTraco = corDestaque === "amarelo" ? "stroke-amber-500" : "stroke-accent";

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`${pctClamped}% ${label ?? "concluído"}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          strokeWidth={strokeWidth}
          className="fill-none stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          className={`fill-none motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-out ${corTraco}`}
        />
      </svg>
      <div className="-mt-[5.5rem] text-center">
        <span className="font-display text-2xl font-bold text-white tabular-nums">{pctClamped}%</span>
      </div>
      {label && <p className="mt-1 text-xs text-slate-400">{label}</p>}
    </div>
  );
}
