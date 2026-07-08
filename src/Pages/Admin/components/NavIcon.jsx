export default function NavIcon({
  icon,
  label,
  active,
  onClick,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="group relative flex items-center justify-center"
    >
      {/* active indicator (desktop only) */}
      <span
        className={`hidden md:block absolute -left-3 h-5 w-1 rounded-full bg-violet-500 transition-all duration-300 ${
          active ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />

      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200
          ${
            active
              ? "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30"
              : "text-zinc-500 hover:text-zinc-100 hover:bg-white/5"
          }`}
      >
        {icon}

        {badge ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-[#0a0a0a]">
            {badge}
          </span>
        ) : null}
      </span>

      {/* tooltip, desktop only */}
      <span
        className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-100 opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100 md:block z-50"
      >
        {label}
      </span>
    </button>
  );
}