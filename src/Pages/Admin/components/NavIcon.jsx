export default function NavIcon({
  icon,
  active,
  onClick,
  label,
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        relative w-11 h-11 flex items-center justify-center rounded-2xl
        transition-all duration-300 cursor-pointer group
        ${
          active
            ? "bg-[#7c5cff] text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_8px_24px_-4px_rgba(124,92,255,0.6)] scale-105"
            : "text-[#6b7280] hover:bg-white/6 hover:text-[#e8eaf0]"
        }
      `}
    >
      {icon}
      {active && (
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#7c5cff] shadow-[0_0_8px_2px_rgba(124,92,255,0.8)] hidden md:block" />
      )}
    </button>
  );
}