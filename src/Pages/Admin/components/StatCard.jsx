import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon,
  trend,          // ex: +12.4
  trendLabel,     // ex: "vs last month"
  accent = "lime", // "lime" | "violet" | "amber"
  sparkline,       // array of numbers for mini chart
}) {
  const accents = {
    lime: { glow: "bg-[#a3e635]/10", text: "text-[#a3e635]", stroke: "#a3e635" },
    violet: { glow: "bg-[#7c5cff]/10", text: "text-[#7c5cff]", stroke: "#7c5cff" },
    amber: { glow: "bg-amber-400/10", text: "text-amber-400", stroke: "#fbbf24" },
  };
  const a = accents[accent] || accents.lime;

  const isUp = (trend ?? 0) >= 0;

  // Mini sparkline path
  const points = sparkline || [];
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const w = 100, h = 32;
  const path = points.length
    ? points
        .map((p, i) => {
          const x = (i / (points.length - 1 || 1)) * w;
          const y = h - ((p - min) / range) * h;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ")
    : "";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#111214]/80 backdrop-blur-xl p-6 group hover:border-white/15 transition-all duration-300">
      {/* Ambient glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${a.glow} group-hover:scale-125 transition-transform duration-500`} />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b7280] mb-2">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-[#e8eaf0] tracking-tight">
            {value}
          </h2>
        </div>

        {icon && (
          <div className={`w-10 h-10 rounded-xl ${a.glow} flex items-center justify-center ${a.text} shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      <div className="relative flex items-end justify-between gap-3">
        {trend !== undefined ? (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? "text-[#a3e635]" : "text-red-400"}`}>
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isUp ? "+" : ""}{trend}%
            {trendLabel && <span className="text-[#6b7280] font-normal ml-1">{trendLabel}</span>}
          </div>
        ) : <span />}

        {points.length > 1 && (
          <svg width={w} height={h} className="shrink-0 overflow-visible">
            <path d={path} fill="none" stroke={a.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </svg>
        )}
      </div>
    </div>
  );
}