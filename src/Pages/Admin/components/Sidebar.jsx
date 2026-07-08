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
  Bell,
  Sparkles,
} from "lucide-react";

import NavIcon from "./NavIcon";

export default function Sidebar({ active, setActive, notifCount = 0 }) {
  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
    { id: "programs", label: "Programmes", icon: <Layers size={18} /> },
    { id: "courses", label: "Cours", icon: <Book size={18} /> },
    { id: "content", label: "Contenu", icon: <FileText size={18} /> },
    { id: "teachers", label: "Enseignants", icon: <Users size={18} /> },
    { id: "students", label: "Étudiants", icon: <GraduationCap size={18} /> },
    { id: "centers", label: "Centres", icon: <Building2 size={18} /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      badge: notifCount > 0 ? notifCount : null,
    },
  ];

  const bottomItems = [
    { id: "security", label: "Sécurité", icon: <Shield size={18} /> },
    { id: "settings", label: "Paramètres", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      {/* Fixed, full height, w-20 — matches the `md:ml-20` offset on <main> */}
      <aside
        className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-20 z-40
          bg-[#0d0d10]/95 backdrop-blur-xl border-r border-white/10"
      >
        {/* LOGO */}
        <div className="flex items-center justify-center h-20 shrink-0 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
            <Sparkles size={18} className="text-violet-400" />
          </div>
        </div>

        {/* TOP NAV — scrolls internally if the list grows, never breaks layout */}
        <nav className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col items-center gap-3 py-6">
          {navItems.map((item) => (
            <NavIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </nav>

        {/* BOTTOM NAV */}
        <div className="flex flex-col items-center gap-3 py-6 border-t border-white/10 shrink-0">
          {bottomItems.map((item) => (
            <NavIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR (bottom dock) ================= */}
      <nav
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50
          w-[94vw] max-w-md flex items-center gap-1.5
          bg-[#0d0d10]/95 backdrop-blur-xl border border-white/10
          px-2 py-2 rounded-3xl shadow-2xl shadow-black/50
          overflow-x-auto no-scrollbar"
      >
        {[...navItems, ...bottomItems].map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            aria-label={item.label}
            aria-current={active === item.id ? "page" : undefined}
            className="relative shrink-0 flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl transition-colors duration-200"
          >
            <span
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                active === item.id
                  ? "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30"
                  : "text-zinc-500"
              }`}
            >
              {item.icon}
              {item.badge ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-[#0d0d10]">
                  {item.badge}
                </span>
              ) : null}
            </span>
            <span
              className={`h-1 w-1 rounded-full transition-opacity duration-200 ${
                active === item.id ? "bg-violet-400 opacity-100" : "opacity-0"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}