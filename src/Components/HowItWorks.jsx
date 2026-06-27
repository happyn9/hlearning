import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import intro from "../assets/intro.mp4";

const IconVideo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
  </svg>
);
const IconPen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IconBrain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a4.5 4.5 0 014 2.5M9.5 2a4.5 4.5 0 00-4 4.5c0 1.4.6 2.6 1.5 3.5M14.5 2a4.5 4.5 0 014 4.5c0 1.4-.6 2.6-1.5 3.5M12 22v-3M12 19a7 7 0 01-7-7v-1.5M12 19a7 7 0 007-7v-1.5"/>
  </svg>
);
const IconPlay = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v14l11-7-11-7z"/>
  </svg>
);
const IconPause = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconMaximize = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
  </svg>
);

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function FeatureRow({ Icon, number, label, desc, accent, accentMuted, index, isActive, onHover, onLeave }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr",
        gap: 16,
        padding: "20px 16px",
        borderRadius: 10,
        background: isActive ? accentMuted : "transparent",
        borderBottom: "1px solid #F3F4F6",
        cursor: "default",
        transition: "background 0.2s",
        marginLeft: -16,
        marginRight: -16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 2 }}>
        <span style={{
          fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.08em",
          color: isActive ? accent : "#D1D5DB",
          transition: "color 0.2s",
        }}>
          {number}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isActive ? accentMuted : "#F3F4F6",
          color: isActive ? accent : "#9CA3AF",
          transition: "all 0.2s",
        }}>
          <Icon />
        </div>
      </div>
      <div>
        <p style={{
          fontSize: 14, fontWeight: 600,
          color: isActive ? "#111827" : "#374151",
          margin: "0 0 5px",
          letterSpacing: "-0.01em",
          transition: "color 0.2s",
        }}>
          {label}
        </p>
        <motion.p
          initial={false}
          animate={{ opacity: isActive ? 1 : 0.55 }}
          transition={{ duration: 0.18 }}
          style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, margin: 0 }}
        >
          {desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

function VideoThumb({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        aspectRatio: "4/3", background: "#111827", cursor: "pointer",
        userSelect: "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 8px 28px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(124,58,237,0.15) 50%, rgba(17,24,39,0) 100%)",
      }} />
      <div style={{ position: "absolute", inset: 0, padding: 28, display: "flex", gap: 16 }}>
        <div style={{ width: "28%", display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
          <div style={{ height: 7, borderRadius: 100, background: "rgba(165,180,252,0.6)", width: "80%" }} />
          {[65, 85, 55, 72].map((w, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 100, width: `${w}%`,
              background: i === 1 ? "rgba(165,180,252,0.45)" : "rgba(255,255,255,0.1)",
            }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ height: 6, borderRadius: 100, width: "45%", background: "rgba(255,255,255,0.12)" }} />
          <div style={{
            flex: 1, borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10, padding: 12,
          }}>
            <div style={{
              width: "100%", aspectRatio: "16/9", borderRadius: 10,
              background: "rgba(79,70,229,0.35)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(99,102,241,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}>
                <IconPlay size={12} />
              </div>
            </div>
            {[70, 48, 60].map((w, i) => (
              <div key={i} style={{ height: 4, borderRadius: 100, width: `${w}%`, background: "rgba(255,255,255,0.09)" }} />
            ))}
          </div>
          <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "38%", borderRadius: 100, background: "#818CF8" }} />
          </div>
        </div>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: hovered ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.22s",
      }}>
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{
            width: 56, height: 56, borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#111827",
            boxShadow: hovered ? "0 0 0 14px rgba(255,255,255,0.12)" : "0 0 0 0px rgba(255,255,255,0)",
            transition: "box-shadow 0.28s ease",
          }}
        >
          <IconPlay size={22} />
        </motion.div>
      </div>
      <div style={{
        position: "absolute", bottom: 14, left: 14,
        display: "flex", alignItems: "center", gap: 7,
        padding: "6px 12px", borderRadius: 100,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: "#F87171",
          animation: "hiwPulse 1.8s infinite",
        }} />
        {t("how.watchDemo", "Watch 2 min demo")}
      </div>
      <div style={{
        position: "absolute", top: 14, right: 14,
        padding: "4px 10px", borderRadius: 6,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
        fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "monospace",
      }}>
        2:14
      </div>
    </motion.div>
  );
}

function VideoModal({ onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying((p) => !p);
  }, [playing]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, onClose]);

  const pct = duration ? (progress / duration) * 100 : 0;
  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - rect.left) / rect.width) * duration;
    if (videoRef.current) videoRef.current.currentTime = t;
    setProgress(t);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, background: "rgba(15,15,30,0.55)", backdropFilter: "blur(12px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 820, background: "#FFFFFF",
          border: "1px solid #E5E7EB", borderRadius: 18, overflow: "hidden",
          boxShadow: "0 28px 70px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid #F3F4F6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#111827" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "-0.01em" }}>
              Product walkthrough
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: "#F3F4F6", border: "1px solid #E5E7EB",
              color: "#9CA3AF", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}
          >
            <IconX />
          </button>
        </div>
        <div
          style={{ position: "relative", background: "#0F172A", aspectRatio: "16/9", cursor: "pointer" }}
          onClick={togglePlay}
        >
          {intro ? (
            <video
              ref={videoRef} src={intro}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onTimeUpdate={() => setProgress(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <p style={{ color: "#475569", fontSize: 13 }}>Connect your video source</p>
              <code style={{ color: "#818CF8", fontSize: 11, opacity: 0.7 }}>{"import intro from \"../assets/intro.mp4\""}</code>
            </div>
          )}
          <AnimatePresence>
            {!playing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.22)",
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: "50%", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#111827", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}>
                  <IconPlay size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
          background: "#FAFAFA", borderTop: "1px solid #F3F4F6",
        }}>
          <button
            onClick={togglePlay}
            style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#fff", border: "1px solid #E5E7EB", color: "#374151", cursor: "pointer",
            }}
          >
            {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
          </button>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#9CA3AF", width: 36, textAlign: "right", flexShrink: 0 }}>
            {fmt(progress)}
          </span>
          <div onClick={seek} style={{
            flex: 1, height: 4, borderRadius: 100,
            background: "#E5E7EB", cursor: "pointer", position: "relative",
          }}>
            <div style={{
              height: "100%", borderRadius: 100, background: "#111827",
              width: `${pct}%`, position: "relative", transition: "width 0.1s linear",
            }}>
              <div style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: "#fff", border: "2px solid #111827",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }} />
            </div>
          </div>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#9CA3AF", width: 36, flexShrink: 0 }}>
            {fmt(duration)}
          </span>
          <button style={{
            width: 28, height: 28, borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "1px solid transparent",
            color: "#9CA3AF", cursor: "pointer",
          }}>
            <IconMaximize />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const FEATURES = [
    {
      Icon: IconVideo,
      number: "01",
      label: t("how.features.video.title"),
      desc: t("how.features.video.desc"),
      accent: "#E0534A",
      accentMuted: "rgba(224,83,74,0.08)",
    },
    {
      Icon: IconPen,
      number: "02",
      label: t("how.features.written.title"),
      desc: t("how.features.written.desc"),
      accent: "#2563EB",
      accentMuted: "rgba(37,99,235,0.08)",
    },
    {
      Icon: IconBrain,
      number: "03",
      label: t("how.features.quiz.title"),
      desc: t("how.features.quiz.desc"),
      accent: "#7C3AED",
      accentMuted: "rgba(124,58,237,0.08)",
    },
  ];

  const activeFeature = FEATURES.find((f) => f.number === activeId);

  return (
    <>
      <style>{`
        @keyframes hiwPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.78); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .hiw-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hiw-sticky {
            position: static !important;
          }
          .hiw-section {
            padding: 48px 20px !important;
          }
        }
      `}</style>

      <section
        ref={ref}
        className="hiw-section"
        style={{
          background: "#FFFFFF",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: "80px 40px",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 480, height: 480, pointerEvents: "none",
          background: activeFeature
            ? `radial-gradient(ellipse at 10% 5%, ${activeFeature.accent}09 0%, transparent 65%)`
            : "radial-gradient(ellipse at 10% 5%, rgba(79,70,229,0.05) 0%, transparent 65%)",
          transition: "background 0.6s ease",
        }} />

        <div style={{ maxWidth: 1080, margin: "0 auto" }} className="hiw-grid">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 48 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 24, height: 1, background: "#D1D5DB" }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#9CA3AF",
                }}>
                  {t("how.sectionLabel", "How it works")}
                </span>
              </div>
              <h2 style={{
                fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.1,
                color: "#111827", margin: "0 0 16px",
              }}>
                {t("how.title")}
              </h2>
              <p style={{
                fontSize: 14, lineHeight: 1.7, color: "#6B7280",
                maxWidth: 360, margin: 0,
              }}>
                {t("how.subtitle", "Pick the format that fits your moment — deep session or five free minutes, it all counts.")}
              </p>
            </motion.div>

            <div style={{ marginLeft: 16, marginRight: 16 }}>
              {FEATURES.map((f, i) => (
                <FeatureRow
                  key={f.number} {...f} index={i}
                  isActive={activeId === f.number}
                  onHover={() => setActiveId(f.number)}
                  onLeave={() => setActiveId(null)}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.45 }}
              style={{ marginTop: 28, paddingLeft: 16 }}
            >
              <a
                href="#"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontSize: 13, fontWeight: 600, color: "#111827",
                  textDecoration: "none", transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {t("how.exploreAll", "Explore all features")} <IconArrowRight />
              </a>
            </motion.div>
          </div>

          {/* Right */}
          <div className="hiw-sticky" style={{ position: "sticky", top: 80 }}>
            <VideoThumb onClick={() => setModalOpen(true)} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ display: "flex" }}>
                {["#C7D2FE", "#DDD6FE", "#BBF7D0", "#FDE68A"].map((bg, i) => (
                  <div key={i} style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: "2px solid #fff", background: bg,
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: 4 - i, position: "relative",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                <span style={{ fontWeight: 600, color: "#111827" }}>4 200+</span>{" "}
                {t("how.enrolled", "learners enrolled")}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeFeature && (
                <motion.div
                  key={activeFeature.number}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  style={{
                    marginTop: 16, padding: "12px 14px", borderRadius: 10,
                    background: activeFeature.accentMuted,
                    border: `1px solid ${activeFeature.accent}20`,
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.8)", color: activeFeature.accent,
                  }}>
                    <activeFeature.Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: activeFeature.accent, marginBottom: 2 }}>
                      {activeFeature.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>
                      {activeFeature.desc.slice(0, 60)}…
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <VideoModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}