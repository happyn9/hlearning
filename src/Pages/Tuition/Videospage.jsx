import { useState, useRef, useEffect } from "react";
import { Play, Mic2, Radio, Clock, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── DATA ───────────────────────────────────────────────── */
const VIDEOS = [
  { id: "v1", videoId: "dQw4w9WgXcQ", title: "French Basics — Greetings & Intro", duration: "12:34", level: "A1", tag: "Grammar" },
  { id: "v2", videoId: "3JZ_D3ELwOQ", title: "Les Verbes du 1er Groupe", duration: "18:02", level: "A2", tag: "Verbs" },
  { id: "v3", videoId: "ScMzIvxBSi4", title: "Prononciation: Sons Difficiles", duration: "09:48", level: "A1", tag: "Phonetics" },
  { id: "v4", videoId: "9bZkp7q19f0", title: "Dialogue: Au Restaurant", duration: "14:20", level: "A2", tag: "Speaking" },
  { id: "v5", videoId: "hT_nvWreIhg", title: "Les Articles Définis & Indéfinis", duration: "11:05", level: "A1", tag: "Grammar" },
  { id: "v6", videoId: "kJQP7kiw5Fk", title: "Vocabulaire: La Ville", duration: "16:44", level: "B1", tag: "Vocab" },
];

const PODCASTS = [
  { id: "p1", videoId: "dQw4w9WgXcQ", title: "Episode 01 — Pourquoi apprendre le français ?", duration: "28:10", guest: "Prof. Marie L.", tag: "Motivation" },
  { id: "p2", videoId: "3JZ_D3ELwOQ", title: "Episode 02 — Immersion ou cours classique ?", duration: "34:55", guest: "Thomas D.", tag: "Method" },
  { id: "p3", videoId: "ScMzIvxBSi4", title: "Episode 03 — Accent & Identité", duration: "41:20", guest: "Aïcha B.", tag: "Culture" },
  { id: "p4", videoId: "9bZkp7q19f0", title: "Episode 04 — Voyager sans parler la langue", duration: "22:30", guest: "Lucas M.", tag: "Travel" },
];

const LEVEL_COLOR = { A1: "#45c2a6", A2: "#e8b339", B1: "#ff6b4a", B2: "#a78bfa" };

/* ── MAIN ───────────────────────────────────────────────── */
export default function VideosPage({ onClose }) {
  const [tab, setTab] = useState("videos");   // "videos" | "podcasts"
  const [active, setActive] = useState(VIDEOS[0]);
  const [hovered, setHovered] = useState(null);
  const playerRef = useRef(null);

  const items = tab === "videos" ? VIDEOS : PODCASTS;

  // switch tab → reset to first item
  useEffect(() => {
    setActive(tab === "videos" ? VIDEOS[0] : PODCASTS[0]);
  }, [tab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,12,26,0.92)",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        display: "flex", flexDirection: "column",
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
        color: "var(--td-text, #f3efe2)",
      }}
    >
      {/* ── TOPBAR ── */}
      <div style={{
        height: 56, flexShrink: 0,
        borderBottom: "1px solid var(--td-border, rgba(245,241,230,0.12))",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 16, justifyContent: "space-between",
        background: "rgba(17,21,42,0.8)",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { key: "videos",   Icon: Play,  label: "Videos" },
            { key: "podcasts", Icon: Mic2,  label: "Podcasts" },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "6px 14px", borderRadius: 10, border: "none",
                background: tab === key ? "var(--td-coral-soft, rgba(255,107,74,0.12))" : "transparent",
                color: tab === key ? "var(--td-coral, #ff6b4a)" : "var(--td-sub, #aeb1c9)",
                fontFamily: "var(--font-stamp, 'IBM Plex Mono', monospace)",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all .15s",
                borderBottom: tab === key ? "2px solid var(--td-coral, #ff6b4a)" : "2px solid transparent",
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 10, border: "none",
            background: "var(--td-surface, rgba(245,241,230,0.045))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--td-sub, #aeb1c9)", cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--td-coral-soft)"; e.currentTarget.style.color = "var(--td-coral)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--td-surface)"; e.currentTarget.style.color = "var(--td-sub)"; }}
        >
          <X size={15} />
        </button>
      </div>

      {/* ── BODY ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1, display: "flex", overflow: "hidden",
            flexDirection: "row",
          }}
        >
          {/* ── PLAYER AREA ── */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            padding: "20px 20px 20px 24px",
            overflow: "hidden", minWidth: 0,
          }}>
            {/* Player */}
            <div
              ref={playerRef}
              style={{
                width: "100%", borderRadius: 18, overflow: "hidden",
                background: "#000",
                border: "1px solid var(--td-border, rgba(245,241,230,0.12))",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                flexShrink: 0,
                aspectRatio: "16/9",
                maxHeight: "60vh",
              }}
            >
              <iframe
                key={active.videoId}
                style={{ width: "100%", height: "100%", display: "block", border: "none" }}
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0&color=white`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Now playing info */}
            <div style={{ marginTop: 18, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                {tab === "videos" && active.level && (
                  <span style={{
                    fontFamily: "var(--font-stamp, monospace)",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                    padding: "3px 8px", borderRadius: 6,
                    background: `${LEVEL_COLOR[active.level]}20`,
                    color: LEVEL_COLOR[active.level],
                    border: `1px solid ${LEVEL_COLOR[active.level]}40`,
                  }}>{active.level}</span>
                )}
                <span style={{
                  fontFamily: "var(--font-stamp, monospace)",
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.1em",
                  color: "var(--td-coral, #ff6b4a)",
                  textTransform: "uppercase",
                }}>{active.tag}</span>
              </div>

              <h2 style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                fontWeight: 700, letterSpacing: "-0.02em",
                color: "var(--td-text, #f3efe2)",
                margin: "0 0 6px",
              }}>{active.title}</h2>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--td-muted, #707599)", fontSize: 12 }}>
                  <Clock size={12} />
                  <span style={{ fontFamily: "var(--font-stamp, monospace)", fontSize: 11 }}>{active.duration}</span>
                </div>
                {tab === "podcasts" && active.guest && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--td-sub, #aeb1c9)", fontSize: 12 }}>
                    <Radio size={12} />
                    <span>{active.guest}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── PLAYLIST SIDEBAR ── */}
          <div style={{
            width: 310, flexShrink: 0,
            borderLeft: "1px solid var(--td-border, rgba(245,241,230,0.12))",
            display: "flex", flexDirection: "column",
            background: "rgba(17,21,42,0.6)",
            overflow: "hidden",
          }}>
            {/* Sidebar header */}
            <div style={{
              padding: "16px 16px 12px",
              borderBottom: "1px solid var(--td-border, rgba(245,241,230,0.12))",
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: "var(--font-stamp, monospace)",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--td-muted, #707599)",
              }}>
                {tab === "videos" ? `${VIDEOS.length} lessons` : `${PODCASTS.length} episodes`}
              </div>
            </div>

            {/* Playlist items */}
            <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
              {items.map((item, i) => {
                const isActive = active.id === item.id;
                const isHov = hovered === item.id;
                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setActive(item)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "13px 16px",
                      borderBottom: "1px solid var(--td-border, rgba(245,241,230,0.12))",
                      cursor: "pointer",
                      background: isActive
                        ? "var(--td-coral-soft, rgba(255,107,74,0.12))"
                        : isHov ? "rgba(245,241,230,0.04)" : "transparent",
                      transition: "background .12s",
                      borderLeft: isActive ? "3px solid var(--td-coral, #ff6b4a)" : "3px solid transparent",
                    }}
                  >
                    {/* Thumbnail / number */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: isActive
                        ? "var(--td-coral-soft)"
                        : "var(--td-surface, rgba(245,241,230,0.045))",
                      border: `1px solid ${isActive ? "var(--td-coral)" : "var(--td-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .15s",
                    }}>
                      {isActive
                        ? (tab === "videos"
                            ? <Play size={15} color="var(--td-coral)" fill="var(--td-coral)" />
                            : <Radio size={15} color="var(--td-coral)" />)
                        : <span style={{
                            fontFamily: "var(--font-stamp, monospace)",
                            fontSize: 11, fontWeight: 700,
                            color: isHov ? "var(--td-text)" : "var(--td-muted)",
                          }}>{String(i + 1).padStart(2, "0")}</span>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, lineHeight: 1.35,
                        color: isActive ? "var(--td-coral)" : isHov ? "var(--td-text)" : "var(--td-sub)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        transition: "color .12s",
                      }}>{item.title}</div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8, marginTop: 4,
                      }}>
                        <span style={{
                          fontFamily: "var(--font-stamp, monospace)",
                          fontSize: 10, color: "var(--td-muted)",
                        }}>{item.duration}</span>
                        {tab === "videos" && item.level && (
                          <span style={{
                            fontFamily: "var(--font-stamp, monospace)",
                            fontSize: 9, fontWeight: 600,
                            color: LEVEL_COLOR[item.level],
                          }}>{item.level}</span>
                        )}
                        {tab === "podcasts" && item.guest && (
                          <span style={{
                            fontSize: 10, color: "var(--td-muted)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{item.guest}</span>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      size={13}
                      color={isActive || isHov ? "var(--td-coral)" : "var(--td-border)"}
                      style={{ flexShrink: 0, transition: "color .12s" }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}