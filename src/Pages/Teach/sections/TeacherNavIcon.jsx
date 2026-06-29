export default function TeacherNavIcon({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 flex items-center justify-center rounded-2xl transition
        ${active
          ? "bg-lime-500 text-black shadow-lg shadow-lime-500/30"
          : "text-gray-500 hover:bg-white/10 hover:text-white"}`}
    >
      {icon}
    </button>
  );
}