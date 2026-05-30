import {
  LayoutDashboard,
  Book,
  Layers,
  FileText,
  Users,
  Shield,
  Settings
} from "lucide-react";

import NavIcon from "./NavIcon";

export default function Sidebar({
  active,
  setActive
}) {

  const navItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={18} />
    },
    {
      id: "programs",
      icon: <Layers size={18} />
    },
    {
      id: "courses",
      icon: <Book size={18} />
    },
    
    {
      id: "content",
      icon: <FileText size={18} />
    },
    {
      id: "users",
      icon: <Users size={18} />
    },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:fixed md:flex left-6 top-24 flex-col justify-between bg-white/70 backdrop-blur-xl border border-gray-200 p-3 rounded-3xl shadow-xl z-40 h-[78vh]">

        {/* TOP */}
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavIcon
              key={item.id}
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
          <NavIcon
            icon={<Shield size={18} />}
            active={active === "security"}
            onClick={() => setActive("security")}
          />

          <NavIcon
            icon={<Settings size={18} />}
            active={active === "settings"}
            onClick={() => setActive("settings")}
          />
        </div>

      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-gray-200 px-4 py-3 rounded-3xl shadow-2xl z-50">

        {navItems.map((item) => (
          <NavIcon
            key={item.id}
            icon={item.icon}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}

      </aside>
    </>
  );
}