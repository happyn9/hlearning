import { useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

/**
 * Gantt chart horizontal — élément signature du dashboard admin.
 * Affiche chaque cours comme une ligne avec une barre représentant
 * sa période (start → end) et son niveau de complétion.
 *
 * items: [{ id, title, start, end, progress (0-100), status }]
 * start/end sont des index de semaine (0-based) sur une grille fixe.
 */
export default function GanttChart({ items = [], totalUnits = 12, unitLabel = "Week" }) {
  const [hovered, setHovered] = useState(null);

  const statusColor = {
    done: { bar: "bg-[#a3e635]", glow: "shadow-[0_0_16px_-2px_rgba(163,230,53,0.6)]", text: "text-[#a3e635]" },
    active: { bar: "bg-[#7c5cff]", glow: "shadow-[0_0_16px_-2px_rgba(124,92,255,0.6)]", text: "text-[#7c5cff]" },
    pending: { bar: "bg-white/10", glow: "", text: "text-[#6b7280]" },
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#111214]/80 backdrop-blur-xl p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#e8eaf0]">Course Timeline</h3>
          <p className="text-xs text-[#6b7280] mt-0.5">Publishing schedule across active courses</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wide text-[#6b7280]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#a3e635]" /> Done</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7c5cff]" /> Active</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/20" /> Pending</span>
        </div>
      </div>

      {/* Grid header (week markers) */}
      <div className="grid mb-3" style={{ gridTemplateColumns: `160px repeat(${totalUnits}, 1fr)` }}>
        <div />
        {Array.from({ length: totalUnits }).map((_, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-[#4b5563]">
            {i % 2 === 0 ? `${unitLabel[0]}${i + 1}` : ""}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const c = statusColor[item.status] || statusColor.pending;
          const span = Math.max(item.end - item.start, 1);
          const isHovered = hovered === item.id;

          return (
            <div
              key={item.id}
              className="grid items-center group"
              style={{ gridTemplateColumns: `160px repeat(${totalUnits}, 1fr)` }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Label */}
              <div className="flex items-center gap-2 pr-3 min-w-0">
                {item.status === "done" ? (
                  <CheckCircle2 size={14} className="text-[#a3e635] shrink-0" />
                ) : item.status === "active" ? (
                  <Clock size={14} className="text-[#7c5cff] shrink-0" />
                ) : (
                  <Circle size={14} className="text-[#4b5563] shrink-0" />
                )}
                <span className="text-sm text-[#e8eaf0] truncate font-medium">{item.title}</span>
              </div>

              {/* Bar track */}
              <div
                className="relative h-7 rounded-lg"
                style={{ gridColumn: `${item.start + 2} / span ${span}` }}
              >
                <div className={`absolute inset-0 rounded-lg ${c.bar} ${c.glow} ${isHovered ? "brightness-110" : ""} transition-all duration-200 overflow-hidden`}>
                  {/* Progress fill overlay for partial completion */}
                  {item.status === "active" && (
                    <div
                      className="absolute inset-y-0 left-0 bg-white/20"
                      style={{ width: `${item.progress}%` }}
                    />
                  )}
                </div>

                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-9 left-0 z-20 bg-[#1a1b1e] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-[#e8eaf0] whitespace-nowrap shadow-xl">
                    <span className={c.text}>{item.progress}%</span> complete
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}