import {
  LayoutDashboard,
  Book,
  Layers,
  FileText,
  Users,
  Shield,
  Settings,
  Building2,
  GraduationCap,
  Bell
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
      id: "teachers",
      icon: <Users size={18} />
    },
    {
      id: "students",
      icon: <GraduationCap size={18} />
    },
    {
      id: "centers",
      icon: <Building2 size={18} />
    },
    {
      id: "notifications",
      icon: <Bell size={18} />
    },
  ];

  const bottomItems = [
    {
      id: "security",
      icon: <Shield size={18} />
    },
    {
      id: "settings",
      icon: <Settings size={18} />
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
          {bottomItems.map((item) => (
            <NavIcon
              key={item.id}
              icon={item.icon}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>

      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[94vw] max-w-md flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 px-3 py-2.5 rounded-3xl shadow-2xl z-50 overflow-x-auto no-scrollbar">

        {[...navItems, ...bottomItems].map((item) => (
          <div key={item.id} className="shrink-0">
            <NavIcon
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