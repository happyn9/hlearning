import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { ArrowRight, Search, Home, BookOpen, LogIn, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";
import { useTranslation } from "react-i18next";

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const COLORS = {
  ink: "#12141C", paper: "#FAF9F5", mint: "#5EEAD4",
  pink: "#F472B6", amber: "#FBBF24", slate: "#7C8394",
};

/* ── Logo ── */
const HLearningLogo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="flameGradNav" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#534AB7" />
        <stop offset="100%" stopColor="#1D9E75" />
      </linearGradient>
    </defs>
    <path d="M20 38C20 38 6 30 7 19C8 11 14 8 14 8C12 14 17 17 18 12C19 7 17 2 22 0C21 7 26 10 27 16C29 10 30 4 28 0C34 7 33 16 31 22C33 30 20 38 20 38Z"
      fill="url(#flameGradNav)" />
    <ellipse cx="20" cy="24" rx="5" ry="7" fill="white" opacity="0.18" />
    <text x="20" y="30" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill="white">h</text>
  </svg>
);

/* ── Search overlay ── */
function SearchOverlay({ open, onClose, navigate }) {
  const [q, setQ] = useState("");
  const courses = [
    { id: 1, title: "Python" }, { id: 2, title: "JavaScript" },
    { id: 3, title: "Java" }, { id: 4, title: "Data Science" },
  ];
  const filtered = q ? courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase())) : courses;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: COLORS.paper }}
        >
          {/* Header search */}
          <div className="flex items-center gap-3 px-5 pt-14 pb-4 border-b border-black/[0.07]">
            <div className="flex-1 flex items-center gap-3 bg-black/[0.05] rounded-2xl px-4 py-3">
              <Search size={16} style={{ color: COLORS.slate }} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/[0.06]">
              <X size={18} style={{ color: COLORS.ink }} />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[11px] uppercase tracking-widest mb-4" style={{ ...mono, color: COLORS.slate }}>
              {q ? "Results" : "All courses"}
            </p>
            <div className="flex flex-col gap-2">
              {filtered.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { onClose(); navigate(`/course/info/${c.id}`); }}
                  className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-left border border-black/[0.07] hover:bg-black/[0.03] transition"
                  style={{ background: "white" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,234,212,0.15)" }}>
                      <BookOpen size={16} style={{ color: COLORS.mint }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{c.title}</span>
                  </div>
                  <ArrowRight size={15} style={{ color: COLORS.slate }} />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar({ OnNav, onModal }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const { t } = useTranslation();

  const [searchOpen, setSearchOpen] = useState(false);

  const connected = Boolean(user);
  const userInitial = user?.name?.charAt(0)?.toUpperCase();
  const goHome = () => trigger(() => navigate("/"));

  if (loading) return null;

  /* ── Bottom nav items (mobile) ── */
  const bottomNav = [
    { icon: Home, label: "Home", action: goHome },
    { icon: Search, label: "Search", action: () => setSearchOpen(true) },
    { icon: BookOpen, label: "Courses", action: () => trigger(() => navigate("/courses")) },
    connected
      ? { icon: () => (
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
              {user?.photo_url
                ? <img src={user.photo_url} className="w-full h-full object-cover" alt="avatar" />
                : userInitial}
            </div>
          ), label: "Profile", action: onModal }
      : { icon: LogIn, label: "Sign in", action: OnNav },
  ];

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <header className="hidden md:block w-full" style={{ background: `${COLORS.paper}CC`, backdropFilter: "blur(12px)" }}>
        {loadingAction && (
          <motion.div className="fixed top-0 left-0 h-[2px] z-50" style={{ background: COLORS.mint }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        )}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
          <div onClick={goHome} className="flex items-center gap-3 cursor-pointer">
            <HLearningLogo />
            <span className="text-xl font-light tracking-tight" style={{ color: COLORS.ink }}>hlearning</span>
          </div>

          {/* Desktop search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t("navbar.search")}
              className="w-80 px-5 py-2.5 rounded-full text-sm outline-none border border-black/[0.08]"
              style={{ background: "rgba(18,20,28,0.04)", color: COLORS.ink, fontFamily: "'Inter',sans-serif" }}
              onFocus={() => setSearchOpen(true)}
              readOnly
            />
            <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.slate }} />
          </div>

          {connected ? (
            <div onClick={onModal} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white cursor-pointer overflow-hidden">
              {user?.photo_url ? <img src={user.photo_url} className="w-full h-full object-cover" alt="avatar" /> : <span>{userInitial}</span>}
            </div>
          ) : (
            <button onClick={OnNav} className="flex cursor-pointer items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition hover:opacity-90"
              style={{ background: COLORS.ink, color: COLORS.paper }}>
              {t("navbar.signup")} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── MOBILE PROGRESS BAR ── */}
      {loadingAction && (
        <motion.div className="fixed top-0 left-0 h-[2px] z-50 md:hidden" style={{ background: COLORS.mint }}
          initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      )}

      {/* ── MOBILE TOP BAR (logo only) ── */}
      <header className="md:hidden flex items-center justify-between px-5 pt-12 pb-3 relative z-10">
        <div onClick={goHome} className="flex items-center gap-2.5 cursor-pointer">
          <HLearningLogo />
          <span className="text-lg font-light tracking-tight" style={{ color: COLORS.ink }}>hlearning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-black/[0.08]"
            style={{ ...mono, color: COLORS.mint, background: "rgba(94,234,212,0.08)" }}>
            <Flame size={11} style={{ color: COLORS.amber }} /> 14d
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2.5 rounded-3xl border border-black/[0.08] shadow-[0_20px_60px_-15px_rgba(18,20,28,0.25)]"
        style={{ background: `${COLORS.paper}E8`, backdropFilter: "blur(20px)" }}>
        {bottomNav.map(({ icon: Icon, label, action }, i) => (
          <button key={label} onClick={action}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all hover:bg-black/[0.05] active:scale-95">
            <div className="w-5 h-5 flex items-center justify-center">
              <Icon size={20} style={{ color: COLORS.ink }} />
            </div>
            <span className="text-[9px] tracking-wide" style={{ ...mono, color: COLORS.slate }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* Search overlay (partagé desktop/mobile) */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
    </>
  );
}