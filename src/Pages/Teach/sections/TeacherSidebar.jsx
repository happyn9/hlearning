import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";

import TeacherNavIcon from "./TeacherNavIcon";

export default function TeacherSidebar({ active, setActive }) {

  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "courses",   icon: <BookOpen size={18} /> },
    { id: "ai",        icon: <Sparkles size={18} /> },
  ];

  const bottomItems = [
    { id: "settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:fixed md:flex left-6 top-24 flex-col justify-between bg-white/70 backdrop-blur-xl border border-gray-200 p-3 rounded-3xl shadow-xl z-40 h-[60vh]">

        {/* TOP */}
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <TeacherNavIcon
              key={item.id}
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
          {bottomItems.map((item) => (
            <TeacherNavIcon
              key={item.id}
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>

      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90vw] max-w-xs flex items-center justify-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 px-3 py-2.5 rounded-3xl shadow-2xl z-50 overflow-x-auto no-scrollbar">
        {[...navItems, ...bottomItems].map((item) => (
          <div key={item.id} className="shrink-0">
            <TeacherNavIcon
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          </div>
        ))}
      </aside>
    </>
  );
}