import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, ChevronRight } from "lucide-react";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const programs = [
  {
    id: "software",
    titleKey: "technology.programs.software.title",
    descKey: "technology.programs.software.desc",
    accent: "#4F46E5", accentMuted: "rgba(79,70,229,0.08)", accentText: "#4F46E5",
    tag: "Engineering", modules: 24, duration: "4 ans", number: "01",
  },
  {
    id: "cs",
    titleKey: "technology.programs.cs.title",
    descKey: "technology.programs.cs.desc",
    accent: "#059669", accentMuted: "rgba(5,150,105,0.08)", accentText: "#059669",
    tag: "Science", modules: 20, duration: "4 ans", number: "02",
  },
  {
    id: "network",
    titleKey: "technology.programs.network.title",
    descKey: "technology.programs.network.desc",
    accent: "#2563EB", accentMuted: "rgba(37,99,235,0.08)", accentText: "#2563EB",
    tag: "Infra", modules: 18, duration: "3 ans", number: "03",
  },
  {
    id: "finance",
    titleKey: "technology.programs.finance.title",
    descKey: "technology.programs.finance.desc",
    accent: "#D97706", accentMuted: "rgba(217,119,6,0.08)", accentText: "#D97706",
    tag: "Business", modules: 16, duration: "3 ans", number: "04",
  },
  {
    id: "accounting",
    titleKey: "technology.programs.accounting.title",
    descKey: "technology.programs.accounting.desc",
    accent: "#DB2777", accentMuted: "rgba(219,39,119,0.08)", accentText: "#DB2777",
    tag: "Finance", modules: 14, duration: "3 ans", number: "05",
  },
  {
    id: "it",
    titleKey: "technology.programs.it.title",
    descKey: "technology.programs.it.desc",
    accent: "#0891B2", accentMuted: "rgba(8,145,178,0.08)", accentText: "#0891B2",
    tag: "Systems", modules: 16, duration: "3 ans", number: "06",
  },
];

const curriculum = {
  software: {
    "Level 1": ["ICT Fundamentals", "Intro to Programming", "Digital Logic"],
    "Level 2": ["Data Structures", "OOP", "Databases", "Web Development"],
    "Level 3": ["Application Development", "Mobile Development"],
    "Level 4": ["Final Year Project"],
  },
  cs: {
    "Level 1": ["Discrete Mathematics", "Programming I"],
    "Level 2": ["Algorithms", "Operating Systems"],
    "Level 3": ["Artificial Intelligence", "Compiler Design"],
    "Level 4": ["Capstone Project"],
  },
  network: {
    "Level 1": ["Networking Basics", "Data Communication"],
    "Level 2": ["Routing & Switching"],
    "Level 3": ["Network Security"],
    "Level 4": ["Enterprise Networks"],
  },
  finance: {
    "Level 1": ["Microeconomics", "Financial Principles"],
    "Level 2": ["Macroeconomics"],
    "Level 3": ["Investment Analysis"],
    "Level 4": ["Finance Project"],
  },
  accounting: {
    "Level 1": ["Financial Accounting"],
    "Level 2": ["Cost Accounting"],
    "Level 3": ["Auditing"],
    "Level 4": ["Accounting Project"],
  },
  it: {
    "Level 1": ["IT Fundamentals"],
    "Level 2": ["Systems Administration"],
    "Level 3": ["Cloud Computing"],
    "Level 4": ["Infrastructure Project"],
  },
};

function CurriculumModal({ program, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const data = curriculum[program.id];
  const levels = Object.entries(data);
  const totalCourses = levels.reduce((a, [, c]) => a + c.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "16px", background: "rgba(15,15,30,0.5)", backdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 520, background: "#FFFFFF",
          border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {loadingAction && (
          <motion.div
            style={{ position: "fixed", top: 0, left: 0, height: 2, zIndex: 99, background: "teal" }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.02 }}
          />
        )}

        <div style={{ height: 3, background: `linear-gradient(90deg, ${program.accent}, ${program.accent}44)` }} />

        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: 6 }}>
                {program.number} — {program.tag.toUpperCase()}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
                {t("technology.viewCurriculum")}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "#F3F4F6", border: "1px solid #E5E7EB",
                color: "#6B7280", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
              }}
            >
              <X size={13} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[`${levels.length} levels`, `${totalCourses} courses`].map((label) => (
              <span key={label} style={{
                fontSize: 11, fontWeight: 600, padding: "4px 10px",
                borderRadius: 100, background: program.accentMuted,
                color: program.accentText, letterSpacing: "0.03em",
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 24px", maxHeight: "40vh", overflowY: "auto", scrollbarWidth: "none" }}>
          {levels.map(([level, courses], li) => (
            <div key={level} style={{ display: "flex", gap: 14, paddingBottom: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: program.accentMuted, color: program.accentText,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                }}>
                  {li + 1}
                </div>
                {li < levels.length - 1 && (
                  <div style={{ width: 1, flex: 1, marginTop: 5, background: "#E5E7EB" }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 8, marginTop: 5 }}>
                  {level}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {courses.map((c) => (
                    <span key={c} style={{
                      fontSize: 12, padding: "4px 10px", borderRadius: 6,
                      background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151",
                    }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px 24px", borderTop: "1px solid #F3F4F6" }}>
          <button
            onClick={() => trigger(() => navigate("/workspace"))}
            style={{
              width: "100%", padding: "13px", borderRadius: 10, border: "none",
              background: program.accent, color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {t("technology.header.cta")} <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgramRow({ p, index, onSelect, isActive, onHover, onLeave }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(p)}
      style={{
        display: "grid", gridTemplateColumns: "48px 1fr auto",
        alignItems: "center", gap: 20, padding: "20px 16px",
        borderBottom: "1px solid #F3F4F6", cursor: "pointer", borderRadius: 8,
        background: isActive ? p.accentMuted : "transparent",
        transition: "background 0.2s", marginLeft: -16, marginRight: -8,
      }}
    >
      <div style={{
        fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        color: isActive ? p.accent : "#D1D5DB", transition: "color 0.2s", paddingLeft: 4,
      }}>
        {p.number}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "2px 7px", borderRadius: 4,
            background: isActive ? `${p.accent}18` : "#F3F4F6",
            color: isActive ? p.accentText : "#9CA3AF", transition: "all 0.2s",
          }}>
            {p.tag}
          </span>
          <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
            {p.duration} · {p.modules} modules
          </span>
        </div>
        <h4 style={{
          fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em",
          color: isActive ? "#111827" : "#374151", margin: 0, transition: "color 0.2s",
        }}>
          {t(p.titleKey)}
        </h4>
        <motion.p
          initial={false}
          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0, marginTop: isActive ? 5 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, overflow: "hidden", margin: 0 }}
        >
          {t(p.descKey)}
        </motion.p>
      </div>
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
        transition={{ duration: 0.18 }}
        style={{ color: p.accent, paddingRight: 4 }}
      >
        <ArrowUpRight size={16} />
      </motion.div>
    </motion.div>
  );
}

export default function Technologies() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const visiblePrograms = showAll ? programs : programs.slice(0, 4);
  const activeProgram = programs.find((p) => p.id === activeId) || programs[0];

  return (
    <>
      <style>{`
        .tech-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 0;
          min-height: 100vh;
        }
        .tech-left {
          padding: 80px 56px 80px 0;
          border-right: 1px solid #F3F4F6;
        }
        .tech-right {
          padding: 80px 0 80px 40px;
        }
        @media (max-width: 900px) {
          .tech-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .tech-left {
            padding: 48px 20px;
            border-right: none;
            border-bottom: 1px solid #F3F4F6;
          }
          .tech-right {
            padding: 32px 20px 48px;
            display: none;
          }
        }
        @media (max-width: 480px) {
          .tech-left {
            padding: 32px 16px;
          }
        }
      `}</style>

      <section
        ref={ref}
        style={{
          background: "#FFFFFF",
          fontFamily: "'Inter', -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 500, height: 500, pointerEvents: "none",
          background: activeId
            ? `radial-gradient(ellipse at 90% 5%, ${activeProgram.accent}10 0%, transparent 65%)`
            : "radial-gradient(ellipse at 90% 5%, rgba(79,70,229,0.06) 0%, transparent 65%)",
          transition: "background 0.6s ease",
        }} />

        {loadingAction && (
          <motion.div
            style={{ position: "fixed", top: 0, left: 0, height: 2, zIndex: 99, background: activeProgram.accent }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.02 }}
          />
        )}

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <div className="tech-grid">

            {/* Left */}
            <div className="tech-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 52 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <div style={{ width: 24, height: 1, background: "#D1D5DB" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9CA3AF" }}>
                    {t("navbar.programs")}
                  </span>
                </div>
                <h1 style={{
                  fontSize: "clamp(26px,4vw,50px)", fontWeight: 700,
                  letterSpacing: "-0.035em", lineHeight: 1.08,
                  color: "#111827", margin: "0 0 18px",
                }}>
                  {t("technology.header.title")}
                </h1>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6B7280", maxWidth: 380, margin: 0 }}>
                  {t("technology.header.subtitle")}
                </p>
              </motion.div>

              <div>
                {visiblePrograms.map((p, i) => (
                  <ProgramRow
                    key={p.id} p={p} index={i}
                    isActive={activeId === p.id}
                    onHover={setActiveId}
                    onLeave={() => setActiveId(null)}
                    onSelect={(prog) => trigger(() => setSelectedProgram(prog))}
                  />
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                onClick={() => setShowAll(!showAll)}
                style={{
                  marginTop: 24,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 18px", borderRadius: 8,
                  border: "1px solid #E5E7EB", background: "#F9FAFB",
                  color: "#6B7280", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", letterSpacing: "0.01em", transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
              >
                {showAll
                  ? t("technology.showLess")
                  : t("technology.showMore", { count: programs.length - 4 })}
                <ChevronRight size={12} style={{ transform: showAll ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </motion.button>
            </div>

            {/* Right — hidden on mobile */}
            <motion.div
              className="tech-right"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div style={{ marginBottom: 36 }}>
                {[
                  { value: "6", label: t("technology.stat.programs", "Programs available") },
                  { value: "4", label: t("technology.stat.levels", "Levels per program") },
                  { value: "100%", label: t("technology.stat.online", "Online learning") },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.09 }}
                    style={{ padding: "18px 0", borderBottom: "1px solid #F3F4F6" }}
                  >
                    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", color: "#111827", lineHeight: 1, marginBottom: 5 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.03em" }}>
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeId && (
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      padding: 16, borderRadius: 12,
                      background: activeProgram.accentMuted,
                      border: `1px solid ${activeProgram.accent}20`,
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: activeProgram.accentText, marginBottom: 10 }}>
                      {t("technology.viewCurriculum")}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {Object.values(curriculum[activeId]).flat().slice(0, 5).map((c) => (
                        <span key={c} style={{
                          fontSize: 11, padding: "3px 8px", borderRadius: 5,
                          background: "rgba(255,255,255,0.7)", color: activeProgram.accentText, fontWeight: 500,
                        }}>
                          {c}
                        </span>
                      ))}
                      {Object.values(curriculum[activeId]).flat().length > 5 && (
                        <span style={{
                          fontSize: 11, padding: "3px 8px", borderRadius: 5,
                          background: "rgba(255,255,255,0.5)", color: activeProgram.accentText, opacity: 0.7, fontWeight: 500,
                        }}>
                          +{Object.values(curriculum[activeId]).flat().length - 5}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <button
                  onClick={() => trigger(() => navigate("/workspace"))}
                  style={{
                    width: "100%", padding: "13px 20px", borderRadius: 10, border: "none",
                    background: "#111827", color: "#fff", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    letterSpacing: "-0.01em", transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {t("technology.header.cta")} <ArrowRight size={14} />
                </button>
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 12, lineHeight: 1.6, textAlign: "center" }}>
                  Instant access · Recognized certificate
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {selectedProgram && (
            <CurriculumModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
          )}
        </AnimatePresence>
      </section>
    </>
  );
}