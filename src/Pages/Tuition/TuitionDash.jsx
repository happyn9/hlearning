import {
  MessageSquare, Video, GraduationCap, Brain, Bell,
  Youtube, MapPin, Phone, X, Play, Sparkles,
  BookOpen, Mic, ChevronRight, Wifi, TrendingUp,
  Star, Zap, Clock, Users, CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ChatPage from "./ChatPage";

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   Light/dark auto via CSS media query injected once
══════════════════════════════════════════════════════════════ */
const STYLE_ID = "tution-dash-tokens";
if (!document.getElementById(STYLE_ID)) {
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
    :root {
      --td-bg: #f4f4f8;
      --td-bg2: #ebebf0;
      --td-surface: rgba(255,255,255,0.78);
      --td-surface-solid: #ffffff;
      --td-border: rgba(0,0,0,0.07);
      --td-border-med: rgba(0,0,0,0.12);
      --td-text: #0d0d12;
      --td-sub: #6b6b80;
      --td-muted: #a0a0b8;
      --td-accent: #5b5ef4;
      --td-accent2: #a855f7;
      --td-accent-soft: rgba(91,94,244,0.09);
      --td-accent-glow: rgba(91,94,244,0.18);
      --td-green: #16a34a;
      --td-green-soft: rgba(22,163,74,0.09);
      --td-amber: #d97706;
      --td-amber-soft: rgba(217,119,6,0.09);
      --td-red: #e11d48;
      --td-shadow-sm: 0 1px 8px rgba(0,0,0,0.05);
      --td-shadow: 0 4px 20px rgba(0,0,0,0.08);
      --td-shadow-lg: 0 12px 40px rgba(0,0,0,0.13);
      --td-shadow-accent: 0 8px 32px rgba(91,94,244,0.28);
      --td-r: 20px;
      --td-r-sm: 12px;
      --td-r-xs: 8px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --td-bg: #0e0e14;
        --td-bg2: #141420;
        --td-surface: rgba(255,255,255,0.05);
        --td-surface-solid: #1a1a28;
        --td-border: rgba(255,255,255,0.08);
        --td-border-med: rgba(255,255,255,0.14);
        --td-text: #f0f0fa;
        --td-sub: #9090b0;
        --td-muted: #5a5a78;
        --td-accent: #7b7ef6;
        --td-accent2: #c084fc;
        --td-accent-soft: rgba(123,126,246,0.12);
        --td-accent-glow: rgba(123,126,246,0.22);
        --td-green: #4ade80;
        --td-green-soft: rgba(74,222,128,0.10);
        --td-amber: #fbbf24;
        --td-amber-soft: rgba(251,191,36,0.10);
        --td-red: #fb7185;
        --td-shadow-sm: 0 1px 8px rgba(0,0,0,0.3);
        --td-shadow: 0 4px 20px rgba(0,0,0,0.4);
        --td-shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
        --td-shadow-accent: 0 8px 32px rgba(123,126,246,0.3);
      }
    }
    .td-scrollbar::-webkit-scrollbar { display: none; }
    .td-scrollbar { scrollbar-width: none; }
    @keyframes td-pulse {
      0%,100% { opacity:.6; transform:scale(1); }
      50% { opacity:1; transform:scale(1.08); }
    }
    @keyframes td-float {
      0%,100% { transform:translateY(0); }
      50% { transform:translateY(-6px); }
    }
    .td-side-icon:hover { background:var(--td-accent-soft) !important; color:var(--td-accent) !important; }
    .td-tool-card:hover { transform:translateY(-4px); box-shadow:var(--td-shadow-lg) !important; }
    .td-plan-card:hover { box-shadow:var(--td-shadow-lg) !important; }
    .td-notif-item:hover { background:var(--td-accent-soft); }
  `;
  document.head.appendChild(el);
}

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const PLANS = [
  {
    key: "free",
    titleKey: "tuitionDash.plans.freeTitle",
    descKey: "tuitionDash.plans.freeDesc",
    badgeKey: "tuitionDash.plans.free",
    Icon: Youtube,
    color: "var(--td-green)",
    soft: "var(--td-green-soft)",
    stat: "120+ videos",
  },
  {
    key: "online",
    titleKey: "tuitionDash.plans.onlineTitle",
    descKey: "tuitionDash.plans.onlineDesc",
    badgeKey: "tuitionDash.plans.online",
    Icon: Wifi,
    color: "var(--td-accent)",
    soft: "var(--td-accent-soft)",
    stat: "Live coaching",
    featured: true,
  },
  {
    key: "presentiel",
    titleKey: "tuitionDash.plans.presentielTitle",
    descKey: "tuitionDash.plans.presentielDesc",
    badgeKey: "tuitionDash.plans.presentiel",
    Icon: MapPin,
    color: "var(--td-amber)",
    soft: "var(--td-amber-soft)",
    stat: "Real classroom",
  },
];

const TOOLS = [
  { titleKey: "tuitionDash.tools.youtube",  type: "video", videoId: "dQw4w9WgXcQ", Icon: Youtube,       color: "#ff2d55", label: "Watch" },
  { titleKey: "tuitionDash.tools.chat",     type: "chat",  Icon: MessageSquare, color: "var(--td-accent)", label: "Chat" },
  { titleKey: "tuitionDash.tools.ai",       type: "ai",    Icon: Sparkles,      color: "var(--td-accent2)", label: "Train" },
  { titleKey: "tuitionDash.tools.french",   type: "video", videoId: "3JZ_D3ELwOQ", Icon: Mic, color: "var(--td-amber)", label: "Listen" },
];

const NOTIFS = [
  { text: "New B2 lesson available", time: "2 min ago", dot: "var(--td-accent)" },
  { text: "Your 7-day streak 🔥", time: "Today", dot: "var(--td-amber)" },
  { text: "Live class tomorrow 10h", time: "Tomorrow", dot: "var(--td-green)" },
];

const NAV_ITEMS = [
  { Icon: Brain,         label: "AI" },
  { Icon: MessageSquare, label: "Chat",    action: "chat" },
  { Icon: Youtube,       label: "Videos" },
  { Icon: Video,         label: "Classes" },
  { Icon: GraduationCap, label: "Progress" },
];

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function TuitionDash() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const [chat, setChat]               = useState(false);
  const [video, setVideo]             = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("online");
  const [notifOpen, setNotifOpen]     = useState(false);
  const [activeNav, setActiveNav]     = useState(0);
  const [loaded, setLoaded]           = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  const handleTool = (tool) => {
    if (tool.type === "video") setVideo(tool.videoId);
    if (tool.type === "chat" || tool.type === "ai") setChat(true);
  };

  const fadeUp = (delay = 0) => prefersReduced ? {} : {
    initial: { opacity: 0, y: 18 },
    animate: loaded ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1], delay },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--td-bg)",
      color: "var(--td-text)",
      fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif",
      overflowX: "hidden",
    }}>

      {/* ── TOPBAR ────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 58,
        background: "rgba(var(--td-bg-rgb,244,244,248),0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--td-border)",
        display: "flex", alignItems: "center",
        padding: "0 20px", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg,var(--td-accent),var(--td-accent2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--td-shadow-accent)",
          }}>
            <BookOpen size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--td-text)", lineHeight: 1 }}>
              H-Tuition
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "var(--td-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              AI English
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Streak pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "var(--td-amber-soft)",
            border: "1px solid rgba(217,119,6,0.2)",
            borderRadius: 20, padding: "4px 10px",
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--td-amber)" }}>7 days</span>
          </div>

          {/* Bell */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: 12,
                background: "var(--td-surface)", border: "1px solid var(--td-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--td-sub)",
                backdropFilter: "blur(8px)",
                transition: "all .15s",
              }}
            >
              <Bell size={15} />
              <span style={{
                position: "absolute", top: 8, right: 8, width: 7, height: 7,
                borderRadius: "50%", background: "var(--td-red)",
                border: "1.5px solid var(--td-bg)",
                animation: "td-pulse 2s infinite",
              }} />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: .97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: .97 }}
                  transition={{ duration: .18 }}
                  style={{
                    position: "absolute", top: 44, right: 0, width: 280,
                    background: "var(--td-surface-solid)",
                    border: "1px solid var(--td-border)",
                    borderRadius: "var(--td-r)",
                    boxShadow: "var(--td-shadow-lg)",
                    overflow: "hidden", zIndex: 300,
                  }}
                >
                  <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid var(--td-border)" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--td-muted)" }}>
                      Notifications
                    </span>
                  </div>
                  {NOTIFS.map((n, i) => (
                    <div
                      key={i}
                      className="td-notif-item"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 14px",
                        borderBottom: i < NOTIFS.length - 1 ? "1px solid var(--td-border)" : "none",
                        cursor: "pointer", transition: "background .12s",
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--td-text)", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: "var(--td-muted)", marginTop: 1 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: "linear-gradient(135deg,var(--td-accent),var(--td-accent2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#fff",
            letterSpacing: "-0.02em",
            boxShadow: "var(--td-shadow-accent)",
          }}>H</div>
        </div>
      </header>

      {/* ── SIDEBAR DESKTOP ────────────────────────────────── */}
      <aside className="hidden md:flex" style={{
        position: "fixed", left: 14, top: 72, bottom: 14, width: 54,
        flexDirection: "column", alignItems: "center",
        gap: 4, padding: "12px 0",
        background: "var(--td-surface)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid var(--td-border)",
        borderRadius: "var(--td-r)",
        boxShadow: "var(--td-shadow)",
        zIndex: 50,
      }}>
        {NAV_ITEMS.map(({ Icon, label, action }, i) => (
          <SideIcon
            key={i}
            icon={<Icon size={16} strokeWidth={2.2} />}
            label={label}
            active={activeNav === i}
            onClick={() => { setActiveNav(i); if (action === "chat") setChat(true); }}
          />
        ))}
      </aside>

      {/* ── BOTTOM NAV MOBILE ──────────────────────────────── */}
      <nav className="md:hidden" style={{
        position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 2,
        padding: "8px 10px",
        background: "var(--td-surface)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid var(--td-border)",
        borderRadius: 22, boxShadow: "var(--td-shadow-lg)", zIndex: 50,
      }}>
        {NAV_ITEMS.map(({ Icon, action }, i) => (
          <button
            key={i}
            onClick={() => { setActiveNav(i); if (action === "chat") setChat(true); }}
            style={{
              width: 42, height: 42, borderRadius: 14, border: "none",
              background: activeNav === i ? "var(--td-accent-soft)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: activeNav === i ? "var(--td-accent)" : "var(--td-sub)",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <Icon size={18} strokeWidth={activeNav === i ? 2.5 : 2} />
          </button>
        ))}
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main style={{
        paddingTop: 76, paddingBottom: 90,
        paddingLeft: 82, paddingRight: 20,
        maxWidth: 1060, margin: "0 auto",
      }} className="md:pl-[82px] pl-5">

        {/* HERO SECTION */}
        <motion.div {...fadeUp(0)} style={{ padding: "20px 0 24px" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--td-accent-soft)",
            border: "1px solid var(--td-accent-glow)",
            borderRadius: 20, padding: "4px 12px", marginBottom: 14,
          }}>
            <Sparkles size={10} color="var(--td-accent)" />
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--td-accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              AI + Real Teachers
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(24px,4vw,34px)",
            fontWeight: 800, letterSpacing: "-0.05em",
            lineHeight: 1.15, margin: "0 0 10px",
            color: "var(--td-text)",
          }}>
            {t("tuitionDash.hero.title")}
          </h1>
          <p style={{ fontSize: 15, color: "var(--td-sub)", lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
            {t("tuitionDash.hero.subtitle")}
          </p>

          {/* Quick stats row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            {[
              { icon: Users,   val: "12k+",  label: "Students" },
              { icon: Star,    val: "4.9",   label: "Rating" },
              { icon: Clock,   val: "200+",  label: "Hours" },
              { icon: Zap,     val: "Live",  label: "Sessions" },
            ].map(({ icon: Icon, val, label }, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.06 * i)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "var(--td-surface)",
                  border: "1px solid var(--td-border)",
                  borderRadius: 12, padding: "7px 12px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon size={12} color="var(--td-accent)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--td-text)" }}>{val}</span>
                <span style={{ fontSize: 11, color: "var(--td-muted)" }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PLAN CARDS */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 28 }}>
          <SectionLabel>Choose your plan</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12, marginTop: 12,
          }}>
            {PLANS.map((plan, i) => {
              const isActive = selectedPlan === plan.key;
              return (
                <motion.div
                  key={plan.key}
                  className="td-plan-card"
                  onClick={() => setSelectedPlan(plan.key)}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                  style={{
                    background: isActive ? "var(--td-surface-solid)" : "var(--td-surface)",
                    border: `1.5px solid ${isActive ? plan.color : "var(--td-border)"}`,
                    borderRadius: "var(--td-r)",
                    padding: "18px 16px 16px",
                    cursor: "pointer",
                    transition: "all .2s",
                    boxShadow: isActive ? `0 6px 28px color-mix(in srgb,${plan.color} 22%,transparent)` : "var(--td-shadow-sm)",
                    position: "relative", overflow: "hidden",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {plan.featured && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: "var(--td-accent)",
                      color: "#fff", fontSize: 8, fontWeight: 800,
                      padding: "2px 7px", borderRadius: 6,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>Popular</div>
                  )}
                  {isActive && (
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                    }}>
                      <CheckCircle2 size={14} color={plan.color} />
                    </div>
                  )}

                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: plan.soft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 12,
                  }}>
                    <plan.Icon size={18} color={plan.color} />
                  </div>

                  <div style={{
                    fontSize: 8, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.12em", color: plan.color,
                    background: plan.soft,
                    display: "inline-block", padding: "2px 7px",
                    borderRadius: 5, marginBottom: 7,
                  }}>
                    {t(plan.badgeKey)}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--td-text)", marginBottom: 4 }}>
                    {t(plan.titleKey)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--td-sub)", lineHeight: 1.5, marginBottom: 12 }}>
                    {t(plan.descKey)}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: plan.color }}>{plan.stat}</span>
                    <ChevronRight size={10} color={plan.color} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* TOOL GRID */}
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: 28 }}>
          <SectionLabel>Learning tools</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))",
            gap: 12, marginTop: 12,
          }}>
            {TOOLS.map((tool, i) => (
              <motion.div
                key={i}
                className="td-tool-card"
                onClick={() => handleTool(tool)}
                whileTap={prefersReduced ? {} : { scale: 0.96 }}
                style={{
                  background: "var(--td-surface)",
                  border: "1px solid var(--td-border)",
                  borderRadius: "var(--td-r)",
                  padding: 14, cursor: "pointer",
                  transition: "all .2s",
                  boxShadow: "var(--td-shadow-sm)",
                  backdropFilter: "blur(12px)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Thumb */}
                <div style={{
                  height: 82, borderRadius: 14,
                  background: `color-mix(in srgb,${tool.color} 10%,transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12, position: "relative", overflow: "hidden",
                }}>
                  {/* Ambient orb */}
                  <div style={{
                    position: "absolute", inset: 0, opacity: 0.4,
                    background: `radial-gradient(circle at 65% 35%,${tool.color},transparent 65%)`,
                  }} />
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    background: `color-mix(in srgb,${tool.color} 18%,var(--td-surface-solid))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 16px color-mix(in srgb,${tool.color} 30%,transparent)`,
                    position: "relative",
                  }}>
                    <tool.Icon size={20} color={tool.color} />
                  </div>
                  {tool.type === "video" && (
                    <div style={{
                      position: "absolute", bottom: 7, right: 7,
                      width: 22, height: 22, borderRadius: 7,
                      background: tool.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 2px 8px color-mix(in srgb,${tool.color} 50%,transparent)`,
                    }}>
                      <Play size={9} color="#fff" fill="#fff" />
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--td-text)", letterSpacing: "-0.02em", marginBottom: 3 }}>
                  {t(tool.titleKey)}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: tool.color }}>
                  {tool.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PROGRESS CARD + STREAK BANNER — 2 col */}
        <motion.div
          {...fadeUp(0.22)}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}
          className="md:grid-cols-2 grid-cols-1"
        >
          {/* Progress card */}
          <div style={{
            background: "var(--td-surface)",
            border: "1px solid var(--td-border)",
            borderRadius: "var(--td-r)",
            padding: "20px 18px",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--td-shadow-sm)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--td-muted)", marginBottom: 4 }}>
                  Weekly progress
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--td-text)" }}>68%</div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "var(--td-accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={16} color="var(--td-accent)" />
              </div>
            </div>
            {/* Bar */}
            <div style={{ height: 6, borderRadius: 6, background: "var(--td-bg2)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg,var(--td-accent),var(--td-accent2))" }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--td-muted)", marginTop: 8 }}>
              3 more sessions to hit your goal
            </div>
          </div>

          {/* Streak banner */}
          <div style={{
            borderRadius: "var(--td-r)", padding: "20px 18px",
            background: "linear-gradient(135deg,var(--td-accent) 0%,var(--td-accent2) 100%)",
            boxShadow: "var(--td-shadow-accent)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20,
              width: 100, height: 100, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: -10,
              width: 120, height: 120, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
                Daily streak
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>
                7 days 🔥
              </div>
            </div>
            <button
              onClick={() => setChat(true)}
              style={{
                marginTop: 16, alignSelf: "flex-start",
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.28)",
                borderRadius: 12, padding: "8px 16px",
                color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                backdropFilter: "blur(8px)", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            >
              <MessageSquare size={13} />
              Start today's lesson
            </button>
          </div>
        </motion.div>

      </main>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {video && <VideoModal videoId={video} onClose={() => setVideo(null)} t={t} />}
      </AnimatePresence>

      {/* ── CHAT ── */}
      {chat && <ChatPage onClose={() => setChat(false)} />}
    </div>
  );
}

/* ── HELPERS ──────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.14em", color: "var(--td-muted)",
      }}>{children}</span>
      <div style={{ flex: 1, height: "0.5px", background: "var(--td-border)" }} />
    </div>
  );
}

function SideIcon({ icon, label, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      className="td-side-icon"
      style={{
        width: 40, height: 40, borderRadius: 13, border: "none",
        background: active ? "var(--td-accent-soft)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: active ? "var(--td-accent)" : "var(--td-sub)",
        cursor: "pointer", transition: "all .15s",
        position: "relative",
      }}
    >
      {icon}
      {active && (
        <span style={{
          position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 14, borderRadius: 2,
          background: "var(--td-accent)",
        }} />
      )}
    </button>
  );
}

/* ── VIDEO MODAL ────────────────────────────────────────────── */
function VideoModal({ videoId, onClose, t }) {
  const ref = useRef(null);

  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const key   = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        ref={ref}
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        style={{
          width: "100%", maxWidth: 780,
          background: "#0c0c14",
          borderRadius: 24, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "13px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* macOS-style traffic lights */}
            {["#ff5f56","#ffbd2e","#27c93f"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
              {t("tuitionDash.video.title", "Lesson Video")}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(255,255,255,0.07)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.55)",
              transition: "background .12s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          >
            <X size={13} />
          </button>
        </div>

        {/* Video */}
        <div style={{ aspectRatio: "16/9" }}>
          <iframe
            style={{ width: "100%", height: "100%", display: "block", border: "none" }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&color=white`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}