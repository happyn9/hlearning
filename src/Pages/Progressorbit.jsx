import { useEffect, useState } from "react";

/**
 * Anneau de progression orbital — élément signature du design.
 * Se trace progressivement au montage, avec le pourcentage
 * affiché en typo mono au centre.
 */
export default function ProgressOrbit({ value = 0, size = 96, stroke = 6 }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    // Petite latence pour laisser le DOM monter avant l'animation du trait
    const t = setTimeout(() => setAnimated(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Piste de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Anneau de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#orbitGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <defs>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c5cff" />
            <stop offset="100%" stopColor="#22d3a8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-semibold text-[#e8eaf0] tabular-nums">
          {Math.round(animated)}%
        </span>
      </div>
    </div>
  );
}