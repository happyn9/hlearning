import {
  MessageSquare, Video, GraduationCap, Brain, Bell,
  Youtube, MapPin, Phone, X, Play, Sparkles,
  BookOpen, Mic, ChevronRight, Wifi, TrendingUp,
  Star, Zap, Clock, Users, CheckCircle2, Stamp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ChatPage from "./ChatPage";
import ProPlanModal from "./Proplanmodal ";
import VideosPage from "./Videospage";

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS — "Language Passport"
   A study desk that looks like a travel document: ink-navy pages,
   coral airmail accents, gold visa-stamp seals, dashed flight
   routes as dividers. Stamps replace the usual pricing-card chrome.
══════════════════════════════════════════════════════════════ */
const STYLE_ID = "td-passport-tokens";
if (!document.getElementById(STYLE_ID)) {
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..800&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

    :root {
      --td-bg: #11152a;
      --td-bg2: #161b35;
      --td-surface: rgba(245,241,230,0.045);
      --td-surface-solid: #1a2040;
      --td-border: rgba(245,241,230,0.12);
      --td-border-med: rgba(245,241,230,0.22);
      --td-text: #f3efe2;
      --td-sub: #aeb1c9;
      --td-muted: #707599;
      --td-coral: #ff6b4a;
      --td-coral-soft: rgba(255,107,74,0.12);
      --td-gold: #e8b339;
      --td-gold-soft: rgba(232,179,57,0.12);
      --td-teal: #45c2a6;
      --td-teal-soft: rgba(69,194,166,0.12);
      --td-red: #ff4d6a;
      --td-shadow-sm: 0 1px 8px rgba(0,0,0,0.25);
      --td-shadow: 0 6px 24px rgba(0,0,0,0.35);
      --td-shadow-lg: 0 16px 48px rgba(0,0,0,0.45);
      --td-shadow-coral: 0 8px 28px rgba(255,107,74,0.3);
      --td-r: 18px;
      --td-r-sm: 12px;
      --td-r-xs: 8px;
      --font-display: 'Fraunces', Georgia, serif;
      --font-body: 'Inter', -apple-system, sans-serif;
      --font-stamp: 'IBM Plex Mono', monospace;
    }
    .td-scrollbar::-webkit-scrollbar { display: none; }
    .td-scrollbar { scrollbar-width: none; }
    @keyframes td-pulse {
      0%,100% { opacity:.6; transform:scale(1); }
      50% { opacity:1; transform:scale(1.08); }
    }
    @keyframes td-drift {
      0% { background-position: 0 0; }
      100% { background-position: 240px 0; }
    }
    .td-route {
      background-image: repeating-linear-gradient(90deg, var(--td-border-med) 0 10px, transparent 10px 18px);
      height: 1px;
    }
    .td-side-icon:hover { background:var(--td-coral-soft) !important; color:var(--td-coral) !important; }
    .td-tool-card:hover { transform:translateY(-4px) rotate(-0.4deg); box-shadow:var(--td-shadow-lg) !important; border-color: var(--td-border-med) !important; }
    .td-stamp:hover { transform: scale(1.03) rotate(var(--rot,-2deg)); }
    .td-notif-item:hover { background:var(--td-coral-soft); }
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
    color: "var(--td-teal)",
    soft: "var(--td-teal-soft)",
    stat: "120+ videos",
    rot: "-2deg",
    stampText: "ENTRY · FREE",
  },
  {
    key: "online",
    titleKey: "tuitionDash.plans.onlineTitle",
    descKey: "tuitionDash.plans.onlineDesc",
    badgeKey: "tuitionDash.plans.online",
    Icon: Wifi,
    color: "var(--td-coral)",
    soft: "var(--td-coral-soft)",
    stat: "Live coaching",
    featured: true,
    rot: "1.5deg",
    stampText: "VISA · LIVE",
  },
  {
    key: "presentiel",
    titleKey: "tuitionDash.plans.presentielTitle",
    descKey: "tuitionDash.plans.presentielDesc",
    badgeKey: "tuitionDash.plans.presentiel",
    Icon: MapPin,
    color: "var(--td-gold)",
    soft: "var(--td-gold-soft)",
    stat: "Real classroom",
    rot: "-1deg",
    stampText: "ARRIVAL · IN PERSON",
  },
];

const TOOLS = [
  { titleKey: "tuitionDash.tools.youtube",  type: "video", videoId: "dQw4w9WgXcQ", Icon: Youtube,       color: "#ff6b4a", label: "Watch" },
  { titleKey: "tuitionDash.tools.chat",     type: "chat",  Icon: MessageSquare, color: "var(--td-coral)", label: "Chat" },
  { titleKey: "tuitionDash.tools.ai",       type: "ai",    Icon: Sparkles,      color: "var(--td-gold)", label: "Train" },
  { titleKey: "tuitionDash.tools.french",   type: "video", videoId: "3JZ_D3ELwOQ", Icon: Mic, color: "var(--td-teal)", label: "Listen" },
];

const NOTIFS = [
  { text: "New B2 lesson available", time: "2 min ago", dot: "var(--td-coral)" },
  { text: "Your 7-day streak 🔥", time: "Today", dot: "var(--td-gold)" },
  { text: "Live class tomorrow 10h", time: "Tomorrow", dot: "var(--td-teal)" },
];

const NAV_ITEMS = [
  { Icon: Brain,         label: "AI" },
  { Icon: MessageSquare, label: "Chat",   action: "chat" },
  { Icon: Youtube,       label: "Videos", action: "videos" },
  { Icon: Video,         label: "Classes" },
  { Icon: GraduationCap, label: "Progress" },
];

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function TuitionDash() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const [videosOpen, setVideosOpen] = useState(false);
  const [chat, setChat]               = useState(false);
  const [video, setVideo]             = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("online");
  const [notifOpen, setNotifOpen]     = useState(false);
  const [activeNav, setActiveNav]     = useState(0);
  const [loaded, setLoaded]           = useState(false);
  const [proModal, setProModal]       = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  const handleTool = (tool) => {
    if (tool.type === "video") setVideo(tool.videoId);
    if (tool.type === "chat" || tool.type === "ai") setChat(true);
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan.key);
    if (plan.key === "online" || plan.key === "presentiel") {
      setProModal(true);
    }else {setVideosOpen(true)}
  };

  const fadeUp = (delay = 0) => prefersReduced ? {} : {
    initial: { opacity: 0, y: 18 },
    animate: loaded ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1], delay },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--td-bg)",
      backgroundImage: "radial-gradient(circle at 12% 8%, rgba(255,107,74,0.06), transparent 38%), radial-gradient(circle at 92% 4%, rgba(232,179,57,0.05), transparent 42%)",
      color: "var(--td-text)",
      fontFamily: "var(--font-body)",
      overflowX: "hidden",
    }}>

      {/* ── TOPBAR ────────────────────────────────────────── */}
      <header style={{
        height: 60,
        background: "rgba(17,21,42,0.86)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--td-border)",
        display: "flex", alignItems: "center",
        padding: "0 20px", justifyContent: "space-between",
      }}>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8,width:"100%",justifyContent:"end" }}>
          {/* Streak pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5, justifySelf:"end",
            background: "var(--td-gold-soft)",
            border: "1px solid rgba(232,179,57,0.3)",
            borderRadius: 20, padding: "4px 10px",
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontFamily: "var(--font-stamp)", fontSize: 11, fontWeight: 600, color: "var(--td-gold)" }}>7 DAYS</span>
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
                    <span style={{ fontFamily: "var(--font-stamp)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--td-muted)" }}>
                      Dispatch
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
            background: "var(--td-surface-solid)",
            border: "1.5px solid var(--td-coral)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 14, fontWeight: 700, color: "var(--td-coral)",cursor:"pointer"
          }}>H</div>
        </div>
      </header>

      {/* ── SIDEBAR DESKTOP ────────────────────────────────── */}
      <aside className="hidden md:flex" style={{
        position: "fixed", left: 14, top: 74, bottom: 14, width: 54,
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
            onClick={() => {
  setActiveNav(i);
  if (action === "chat") setChat(true);
  if (action === "videos") setVideosOpen(true);
}}
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
              background: activeNav === i ? "var(--td-coral-soft)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: activeNav === i ? "var(--td-coral)" : "var(--td-sub)",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <Icon size={18} strokeWidth={activeNav === i ? 2.5 : 2} />
          </button>
        ))}
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main style={{
        paddingTop: 80, paddingBottom: 90,
        paddingLeft: 82, paddingRight: 20,
        maxWidth: 1060, margin: "0 auto",
      }} className="md:pl-20.5 pl-5">

        {/* HERO SECTION */}
        <motion.div {...fadeUp(0)} style={{ padding: "24px 0 26px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            border: "1px solid var(--td-border-med)",
            borderRadius: 4, padding: "4px 10px", marginBottom: 16,
            fontFamily: "var(--font-stamp)",
          }}>
            <Stamp size={11} color="var(--td-coral)" />
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--td-coral)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              No. 0742 · Issued today
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(30px,5vw,46px)",
            fontWeight: 700, letterSpacing: "-0.02em",
            lineHeight: 1.08, margin: "0 0 12px",
            color: "var(--td-text)",
          }}>
            {t("tuitionDash.hero.title")}
          </h1>
          <p style={{ fontSize: 15.5, color: "var(--td-sub)", lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
            {t("tuitionDash.hero.subtitle")}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 22, alignItems: "center" }}>
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
                  padding: "0 16px",
                  borderRight: i < 3 ? "1px solid var(--td-border)" : "none",
                }}
              >
                <Icon size={13} color="var(--td-coral)" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--td-text)" }}>{val}</span>
                <span style={{ fontFamily: "var(--font-stamp)", fontSize: 10, color: "var(--td-muted)", letterSpacing: "0.04em" }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="td-route" style={{ margin: "4px 0 28px" }} />

        {/* PLAN STAMPS */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 30 }}>
          <SectionLabel>Choose your route</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: 18, marginTop: 18,
          }}>
            {PLANS.map((plan) => {
              const isActive = selectedPlan === plan.key;
              const isPaid = plan.key === "online" || plan.key === "presentiel";
              return (
                <motion.div
                  key={plan.key}
                  className="td-stamp"
                  onClick={() => handlePlanClick(plan)}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  style={{
                    "--rot": plan.rot,
                    background: "var(--td-surface)",
                    border: `2px dashed ${isActive ? plan.color : "var(--td-border-med)"}`,
                    borderRadius: "var(--td-r)",
                    padding: "20px 16px 18px",
                    cursor: "pointer",
                    transition: "all .2s",
                    transform: `rotate(${plan.rot})`,
                    position: "relative", overflow: "hidden",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {plan.featured && (
                    <div style={{
                      position: "absolute", top: 10, right: -26,
                      background: "var(--td-coral)",
                      color: "#11152a", fontFamily: "var(--font-stamp)",
                      fontSize: 8, fontWeight: 700,
                      padding: "2px 28px", transform: "rotate(40deg)",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>Popular</div>
                  )}

                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: `1.5px solid ${plan.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 14,
                  }}>
                    <plan.Icon size={17} color={plan.color} />
                  </div>

                  <div style={{
                    fontFamily: "var(--font-stamp)",
                    fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                    letterSpacing: "0.14em", color: plan.color,
                    marginBottom: 8,
                  }}>
                    {plan.stampText}
                  </div>

                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--td-text)", marginBottom: 5 }}>
                    {t(plan.titleKey)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--td-sub)", lineHeight: 1.55, marginBottom: 14 }}>
                    {t(plan.descKey)}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {isActive && <CheckCircle2 size={12} color={plan.color} />}
                    <span style={{ fontFamily: "var(--font-stamp)", fontSize: 10, fontWeight: 600, color: plan.color }}>
                      {isPaid ? "SUBSCRIBE" : plan.stat.toUpperCase()}
                    </span>
                    <ChevronRight size={10} color={plan.color} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* TOOL GRID */}
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: 30 }}>
          <SectionLabel>Onboard tools</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))",
            gap: 12, marginTop: 16,
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
                <div style={{
                  height: 82, borderRadius: 14,
                  background: `color-mix(in srgb,${tool.color} 12%,transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12, position: "relative", overflow: "hidden",
                  border: `1px solid color-mix(in srgb,${tool.color} 25%,transparent)`,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "var(--td-surface-solid)",
                    border: `1.5px solid ${tool.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <tool.Icon size={19} color={tool.color} />
                  </div>
                  {tool.type === "video" && (
                    <div style={{
                      position: "absolute", bottom: 7, right: 7,
                      width: 22, height: 22, borderRadius: 7,
                      background: tool.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 2px 8px color-mix(in srgb,${tool.color} 50%,transparent)`,
                    }}>
                      <Play size={9} color="#11152a" fill="#11152a" />
                    </div>
                  )}
                </div>

                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--td-text)", letterSpacing: "-0.01em", marginBottom: 3 }}>
                  {t(tool.titleKey)}
                </div>
                <div style={{ fontFamily: "var(--font-stamp)", fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: tool.color }}>
                  {tool.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PROGRESS CARD + STREAK BANNER */}
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
                <div style={{ fontFamily: "var(--font-stamp)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--td-muted)", marginBottom: 5 }}>
                  Distance covered
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--td-text)" }}>68%</div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                border: "1.5px solid var(--td-coral)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={15} color="var(--td-coral)" />
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "var(--td-bg2)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 6, background: "var(--td-coral)" }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--td-muted)", marginTop: 9 }}>
              3 more sessions to your next stamp
            </div>
          </div>

          {/* Streak banner */}
          <div style={{
            borderRadius: "var(--td-r)", padding: "20px 18px",
            background: "var(--td-coral)",
            boxShadow: "var(--td-shadow-coral)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -24, right: -18, width: 110, height: 110,
              border: "1.5px dashed rgba(17,21,42,0.25)", borderRadius: "50%",
            }} />
            <div>
              <div style={{ fontFamily: "var(--font-stamp)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(17,21,42,0.6)", marginBottom: 5 }}>
                Consecutive days
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "#11152a" }}>
                7 days 🔥
              </div>
            </div>
            <button
              onClick={() => setChat(true)}
              style={{
                marginTop: 16, alignSelf: "flex-start",
                background: "#11152a",
                border: "none",
                borderRadius: 11, padding: "9px 16px",
                color: "#f3efe2", fontSize: 12, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                transition: "opacity .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
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

      <AnimatePresence>
  {videosOpen && <VideosPage onClose={() => setVideosOpen(false)} />}
</AnimatePresence>

      {/* ── CHAT ── */}
      {chat && <ChatPage onClose={() => setChat(false)} />}

      {/* ── PRO PLAN MODAL ── */}
      <AnimatePresence>
        {proModal && <ProPlanModal onClose={() => setProModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── HELPERS ──────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontFamily: "var(--font-stamp)",
        fontSize: 10, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.18em", color: "var(--td-muted)",
      }}>{children}</span>
      <div className="td-route" style={{ flex: 1 }} />
    </div>
  );
}

function SideIcon({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="td-side-icon"
      style={{
        width: 40, height: 40, borderRadius: 13, border: "none",
        background: active ? "var(--td-coral-soft)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: active ? "var(--td-coral)" : "var(--td-sub)",
        cursor: "pointer", transition: "all .15s",
        position: "relative",
      }}
    >
      {icon}
      {active && (
        <span style={{
          position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 14, borderRadius: 2,
          background: "var(--td-coral)",
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
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "13px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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