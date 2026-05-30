// NavIcon.jsx

export default function NavIcon({
  icon,
  active,
  onClick
}) {

  return (
    <button
      onClick={onClick}
      className={`
        w-11 h-11 flex items-center justify-center rounded-2xl
        transition-all duration-200 cursor-pointer
        ${
          active
            ? "bg-black text-white shadow-lg scale-105"
            : "text-gray-600 hover:bg-gray-200/70 hover:text-black"
        }
      `}
    >
      {icon}
    </button>
  );
}