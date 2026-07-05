import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useUser } from "../../context/UserContext";
import { ArrowRight, Search, Home, BookOpen, LogIn, X, Flame, CornerDownLeft, TrendingUp, Code2, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";
import { useTranslation } from "react-i18next";
import { usePwaDisplayMode, hapticTap } from "../../hooks/usePwaDisplayMode";

const sf = { fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif" };

const COLORS = {
  ink: "#1D1D1F",
  gray: "#86868B",
  hairline: "rgba(0,0,0,0.08)",
  surface: "rgba(255,255,255,0.82)",
  surfaceSolid: "#FFFFFF",
  blue: "#0071E3",
  blueHover: "#0077ED",
  blueTint: "rgba(0,113,227,0.08)",
};

const HLearningMark = () => (
  <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
    <path
      d="M20 36C20 36 8 29 8.5 19.5C9 12.5 15 10 15 10C13.5 15 17 17 17.5 13.5C18 10 16.5 6.5 20 5C19 10 23 12.5 23.5 17C25 12.5 26 8 24.5 5C29 10 28 17 26.5 21.5C28 29 20 36 20 36Z"
      stroke={COLORS.ink}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

function ResultRow({ course, active, onHover, onSelect, index }) {
  const { t } = useTranslation();
  const Icon = course.icon;
  return (
    <button
      onMouseEnter={() => onHover(index)}
      onClick={onSelect}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition-colors"
      style={{ background: active ? COLORS.blueTint : "transparent" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-colors"
          style={{ background: active ? COLORS.blue : "#F0F0F2" }}
        >
          <Icon size={15} style={{ color: active ? "#FFFFFF" : COLORS.gray }} />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] truncate" style={{ ...sf, color: COLORS.ink, fontWeight: 500 }}>{course.title}</div>
          <div className="text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>{course.category}</div>
        </div>
      </div>
      {active ? (
        <div className="flex items-center gap-1 shrink-0" style={{ color: COLORS.blue }}>
          <span className="text-[11px]" style={{ ...sf }}>{t("navbar.open")}</span>
          <CornerDownLeft size={13} />
        </div>
      ) : course.trending ? (
        <TrendingUp size={13} style={{ color: COLORS.gray }} className="shrink-0" />
      ) : null}
    </button>
  );
}

function SearchOverlay({ open, onClose, navigate }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const { user } = useUser();
  const isConnected = Boolean(user);

  const COURSES = [
    { id: 1, title: "Python", category: t("navbar.categories.language"), icon: Code2, trending: true },
    { id: 2, title: "JavaScript", category: t("navbar.categories.language"), icon: Code2, trending: true },
    { id: 3, title: "Java", category: t("navbar.categories.language"), icon: Code2 },
    { id: 4, title: "Data Science", category: t("navbar.categories.data"), icon: Database, trending: true },
  ];

  const filtered = q ? COURSES.filter(c => c.title.toLowerCase().includes(q.toLowerCase())) : COURSES;

  useEffect(() => setActiveIndex(0), [q, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[activeIndex]) {
        onClose();
        if (isConnected) {
          navigate(`/course/info/${filtered[activeIndex].id}`);
        }
        navigate('/auth')
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex, onClose, navigate]);

  const select = (course) => { onClose(); navigate(`/course/info/${course.id}`); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex flex-col items-center px-4 pt-[8vh] sm:pt-[14vh]"
          style={{ background: "rgba(29,29,31,0.35)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            onAnimationComplete={() => inputRef.current?.focus()}
            className="w-full max-w-[560px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: COLORS.surfaceSolid,
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.04)",
              maxHeight: "70vh",
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: COLORS.hairline }}>
              <Search size={18} style={{ color: COLORS.blue }} strokeWidth={2.25} />
              <input
                ref={inputRef}
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("navbar.searchOverlayPlaceholder")}
                className="flex-1 bg-transparent outline-none text-[16px]"
                style={{ ...sf, color: COLORS.ink }}
              />
              {q && (
                <button onClick={() => setQ("")} className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#EDEDEF" }}>
                  <X size={11} style={{ color: COLORS.gray }} />
                </button>
              )}
              <button onClick={onClose} className="text-[12px] px-2 py-1 rounded-md shrink-0" style={{ ...sf, color: COLORS.gray, background: "#F5F5F7" }}>
                esc
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-2">
              <p className="text-[11px] uppercase tracking-wide px-2.5 pt-2 pb-1.5" style={{ ...sf, color: COLORS.gray, letterSpacing: "0.04em" }}>
                {q ? t("navbar.resultsCount", { count: filtered.length }) : t("navbar.trending")}
              </p>
              {filtered.length > 0 ? (
                <div className="flex flex-col gap-0.5 pb-1">
                  {filtered.map((c, i) => (
                    <ResultRow
                      key={c.id}
                      course={c}
                      index={i}
                      active={i === activeIndex}
                      onHover={setActiveIndex}
                      onSelect={() => select(c)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "#F5F5F7" }}>
                    <Search size={16} style={{ color: COLORS.gray }} />
                  </div>
                  <p className="text-[14px]" style={{ ...sf, color: COLORS.ink, fontWeight: 500 }}>{t("navbar.noResults", { query: q })}</p>
                  <p className="text-[12.5px] mt-1" style={{ ...sf, color: COLORS.gray }}>{t("navbar.noResultsHint")}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 py-2.5 border-t" style={{ borderColor: COLORS.hairline, background: "#FAFAFA" }}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
                  <span className="px-1.5 py-0.5 rounded-[5px] text-[10px]" style={{ background: "#EFEFF1" }}>↑↓</span> {t("navbar.navigate")}
                </span>
                <span className="flex items-center gap-1 text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
                  <span className="px-1.5 py-0.5 rounded-[5px] text-[10px]" style={{ background: "#EFEFF1" }}>↵</span> {t("navbar.open")}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
                <span className="px-1.5 py-0.5 rounded-[5px] text-[10px]" style={{ background: "#EFEFF1" }}>esc</span> {t("navbar.close")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   BOTTOM NAV — façon "vraie app" native, avec retour haptique
═══════════════════════════════════════════════════════════ */
function AppBottomNav({ items }) {
  return (
    <nav
      className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 px-1.5 py-1.5 rounded-[26px]"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        background: COLORS.surface,
        backdropFilter: "saturate(200%) blur(24px)",
        WebkitBackdropFilter: "saturate(200%) blur(24px)",
        border: `1px solid ${COLORS.hairline}`,
        boxShadow: `
          0 1px 0 rgba(255,255,255,0.6) inset,
          0 18px 40px -12px rgba(0,0,0,0.18),
          0 4px 10px rgba(0,0,0,0.06)
        `,
      }}
    >
      {items.map(({ icon: Icon, label, action, active }) => (
        <motion.button
          key={label}
          onClick={() => { hapticTap(); action(); }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-[18px] active:scale-95"
        >
          {active && (
            <motion.span
              layoutId="bottomNavPill"
              className="absolute inset-0 rounded-[18px]"
              style={{ background: COLORS.blueTint }}
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
            />
          )}
          <div className="relative w-5 h-5 flex items-center justify-center z-10">
            <Icon
              size={19}
              style={{ color: active ? COLORS.blue : COLORS.ink }}
              strokeWidth={active ? 2.1 : 1.75}
            />
          </div>
          <span
            className="relative z-10 text-[9px] transition-colors"
            style={{ ...sf, color: active ? COLORS.blue : COLORS.gray, fontWeight: active ? 600 : 400 }}
          >
            {label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}

export default function Navbar({ OnNav, onModal }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const { t } = useTranslation();
  const displayMode = usePwaDisplayMode();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const connected = Boolean(user);
  const userInitial = user?.name?.charAt(0)?.toUpperCase();
  const goHome = () => { hapticTap(); trigger(() => navigate("/")); };

  if (loading) return null;

  const bottomNav = [
    { icon: Home, label: t("navbar.home"), action: goHome, active: location.pathname === "/" },
    { icon: Search, label: t("navbar.searchLabel"), action: () => setSearchOpen(true), active: searchOpen },
    { icon: BookOpen, label: "hblog", action: () => trigger(() => navigate("/hblog")), active: location.pathname.startsWith("/hblog") },
    connected
      ? {
          icon: () => (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium overflow-hidden" style={{ background: COLORS.blueTint, color: COLORS.blue }}>
              {user?.photo_url
                ? <img src={user.photo_url} className="w-full h-full object-cover" alt="avatar" />
                : userInitial}
            </div>
          ),
          label: t("navbar.profile"),
          action: onModal,
          active: false,
        }
      : { icon: LogIn, label: t("navbar.signin"), action: OnNav, active: location.pathname === "/auth" },
  ];

  /* Quand l'app tourne en fullscreen réel (Android), il n'y a plus de
     barre système du tout — le contenu peut se retrouver littéralement
     sous l'encoche/caméra perforée. On force une marge de sécurité
     minimale dans ce cas précis ; sinon on se fie à env(safe-area-inset-top)
     natif (suffisant en standalone/navigateur). */
  const topPadding =
    displayMode === "fullscreen"
      ? "max(env(safe-area-inset-top, 0px), 28px)"
      : "env(safe-area-inset-top, 0px)";

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <header
        className="hidden md:block w-full sticky top-0 z-40 border-b"
        style={{ background: COLORS.surface, backdropFilter: "saturate(180%) blur(20px)", borderColor: COLORS.hairline }}
      >
        {loadingAction && (
          <motion.div className="fixed top-0 left-0 h-[2px] z-50" style={{ background: COLORS.blue }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        )}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-14">
          <div onClick={goHome} className="flex items-center gap-2 cursor-pointer">
            <HLearningMark />
            <span className="text-[17px] font-semibold tracking-tight" style={{ ...sf, color: COLORS.ink }}>
              hlearning
            </span>
          </div>

          <motion.div
            className="relative flex items-center rounded-full"
            animate={{ width: searchFocused ? 320 : 240 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ background: "#F5F5F7" }}
          >
            <Search size={14} className="absolute left-3.5" style={{ color: COLORS.gray }} />
            <input
              type="text"
              placeholder={t("navbar.search")}
              className="w-full pl-9 pr-4 py-2 rounded-full text-[13px] outline-none bg-transparent"
              style={{ ...sf, color: COLORS.ink }}
              onFocus={() => { setSearchFocused(true); setSearchOpen(true); }}
              onBlur={() => setSearchFocused(false)}
              readOnly
            />
          </motion.div>

          {connected ? (
            <div onClick={onModal} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden" style={{ background: COLORS.blueTint, color: COLORS.blue }}>
              {user?.photo_url ? <img src={user.photo_url} className="w-full h-full object-cover" alt="avatar" /> : <span style={{ ...sf, fontSize: 13, fontWeight: 500 }}>{userInitial}</span>}
            </div>
          ) : (
            <button
              onClick={OnNav}
              className="flex items-center gap-1.5 text-[14px] font-medium transition-colors"
              style={{ ...sf, color: COLORS.blue }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.blueHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.blue)}
            >
              {t("navbar.signup")} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </header>

      {/* ── MOBILE PROGRESS BAR ── */}
      {loadingAction && (
        <motion.div className="fixed top-0 left-0 h-[2px] z-50 md:hidden" style={{ background: COLORS.blue }}
          initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      )}

      {/* ── MOBILE TOP BAR — padding haut dynamique selon le mode d'affichage ── */}
      <header
        className="md:hidden flex items-center justify-between px-5 pb-3 relative z-10 border-b"
        style={{
          background: COLORS.surfaceSolid,
          borderColor: COLORS.hairline,
          paddingTop: `calc(${topPadding} + 12px)`,
        }}
      >
        <div onClick={goHome} className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
          <HLearningMark />
          <span className="text-[16px] font-semibold tracking-tight" style={{ ...sf, color: COLORS.ink }}>hlearning</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full" style={{ ...sf, color: COLORS.gray, background: "#F5F5F7" }}>
          <Flame size={12} style={{ color: COLORS.blue }} /> 14{t("navbar.streakDay")}
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV ── */}
      <AppBottomNav items={bottomNav} />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
    </>
  );
}