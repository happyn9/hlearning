import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";

/* ── Styles ─────────────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("courses-light-styles")) return;
  const s = document.createElement("style");
  s.id = "courses-light-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap');

    .csl-root {
      font-family: 'Inter', system-ui, sans-serif;
      background: #F7F6F3;
      color: #1A1A2E;
      padding: 88px 24px 100px;
    }
    .csl-root * { box-sizing: border-box; }
    .csl-inner { max-width: 1180px; margin: 0 auto; }

    /* Header */
    .csl-header {
      display: flex; align-items: flex-end;
      justify-content: space-between;
      gap: 24px; margin-bottom: 36px; flex-wrap: wrap;
    }
    .csl-eyebrow {
      font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
      text-transform: uppercase; color: #6366F1;
      margin-bottom: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .csl-eyebrow::before {
      content: ''; display: inline-block;
      width: 20px; height: 1.5px; background: #6366F1;
    }
    .csl-h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(30px, 4vw, 48px);
      font-weight: 700; line-height: 1.1;
      letter-spacing: -0.02em; color: #0F0F1A; margin: 0;
    }
    .csl-h2 em { font-style: italic; color: #6366F1; }
    .csl-subtitle {
      font-size: 15px; color: #6B7280;
      line-height: 1.65; margin-top: 12px; max-width: 420px;
    }
    .csl-count {
      font-size: 13px; color: #9CA3AF;
      font-weight: 500; align-self: flex-end;
      white-space: nowrap;
    }

    /* Tabs — pill group */
    .csl-tabs {
      display: flex; gap: 2px;
      background: #EDECE8; border-radius: 12px;
      padding: 4px; width: fit-content;
      flex-wrap: wrap; margin-bottom: 36px;
    }
    .csl-tab {
      padding: 9px 18px; border-radius: 9px;
      border: none; background: transparent;
      color: #6B7280; font-size: 13px; font-weight: 500;
      font-family: 'Inter', sans-serif; cursor: pointer;
      white-space: nowrap; transition: all 0.18s;
    }
    .csl-tab:hover { color: #1A1A2E; }
    .csl-tab.active {
      background: #fff; color: #0F0F1A; font-weight: 600;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
    }

    /* Grid */
    .csl-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    /* Card */
    .csl-card {
      background: #fff; border-radius: 16px;
      overflow: hidden; border: 1px solid rgba(0,0,0,0.06);
      display: flex; flex-direction: column; cursor: pointer;
      transition: box-shadow 0.22s, transform 0.22s;
    }
    .csl-card:hover {
      box-shadow: 0 16px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
      transform: translateY(-4px);
    }

    /* Image */
    .csl-img-wrap { position: relative; height: 172px; overflow: hidden; flex-shrink: 0; }
    .csl-img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.5s ease;
    }
    .csl-card:hover .csl-img { transform: scale(1.06); }
    .csl-img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%);
    }
    .csl-school-chip {
      position: absolute; bottom: 10px; left: 10px;
      background: rgba(255,255,255,0.93); backdrop-filter: blur(6px);
      border: 1px solid rgba(0,0,0,0.07);
      padding: 4px 10px; border-radius: 99px;
      font-size: 11px; font-weight: 700; color: #1A1A2E; letter-spacing: 0.04em;
    }
    .csl-arrow {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      background: #6366F1; color: #fff;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: scale(0.65);
      transition: opacity 0.2s, transform 0.2s;
    }
    .csl-card:hover .csl-arrow { opacity: 1; transform: scale(1); }

    /* Body */
    .csl-body { padding: 18px 18px 12px; flex: 1; display: flex; flex-direction: column; }
    .csl-program {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: #6366F1; margin-bottom: 7px;
    }
    .csl-title {
      font-family: 'Playfair Display', serif;
      font-size: 15.5px; font-weight: 700;
      color: #0F0F1A; line-height: 1.4; margin: 0 0 auto;
    }
    .csl-meta {
      display: flex; align-items: center; gap: 6px;
      margin-top: 14px; font-size: 12px; color: #9CA3AF;
    }
    .csl-meta-sep { width: 3px; height: 3px; border-radius: 50%; background: #D1D5DB; }

    /* CTA */
    .csl-cta {
      margin: 12px 18px 18px; padding: 11px 0;
      border-radius: 10px; border: 1.5px solid #E5E7EB;
      background: #F9FAFB; color: #374151;
      font-size: 13px; font-weight: 600;
      font-family: 'Inter', sans-serif; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .csl-cta:hover { background: #6366F1; border-color: #6366F1; color: #fff; }

    /* Responsive */
    @media (max-width: 1040px) { .csl-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) {
      .csl-root { padding: 52px 16px 64px; }
      .csl-grid { grid-template-columns: 1fr; gap: 12px; }
      .csl-tabs { overflow-x: auto; scrollbar-width: none; }
      .csl-header { flex-direction: column; align-items: flex-start; }
    }
  `;
  document.head.appendChild(s);
};

/* ── Card component ──────────────────────────────────────────────────── */
function CourseCard({ course, index, ctaLabel }) {
  return (
    <motion.div
      className="csl-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="csl-img-wrap">
        <img
          className="csl-img"
          src={`${course.image}?auto=format&w=600&q=80`}
          alt={course.title}
          loading="lazy"
        />
        <div className="csl-img-overlay" />
        <span className="csl-school-chip">{course.school}</span>
        <div className="csl-arrow"><ArrowUpRight size={14} /></div>
      </div>

      <div className="csl-body">
        <p className="csl-program">{course.program}</p>
        <h3 className="csl-title">{course.title}</h3>
        <div className="csl-meta">
          <GraduationCap size={12} />
          <span>{course.school}</span>
          <span className="csl-meta-sep" />
          <BookOpen size={11} />
          <span>Online</span>
        </div>
      </div>

      <button className="csl-cta">
        {ctaLabel} <ArrowUpRight size={13} />
      </button>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function CoursesSection() {
  injectStyles();

  const [activeTab, setActiveTab] = useState("business");
  const { t } = useTranslation();

  const tabs = [
    { id: "software",         label: t("courses.tabs.software") },
    { id: "business",         label: t("courses.tabs.business") },
    { id: "law",              label: t("courses.tabs.law") },
    { id: "management",       label: t("courses.tabs.management") },
    { id: "entrepreneurship", label: t("courses.tabs.entrepreneurship") },
  ];

  const coursesData = {
    software: [
      { title: t("courses.software.0.title"), program: t("courses.software.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.software.1.title"), program: t("courses.software.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.software.2.title"), program: t("courses.software.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.software.3.title"), program: t("courses.software.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
    ],
    business: [
      { title: t("courses.business.0.title"), program: t("courses.business.0.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" },
      { title: t("courses.business.1.title"), program: t("courses.business.1.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
      { title: t("courses.business.2.title"), program: t("courses.business.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
      { title: t("courses.business.3.title"), program: t("courses.business.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
    ],
    law: [
      { title: t("courses.law.0.title"), program: t("courses.law.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7" },
      { title: t("courses.law.1.title"), program: t("courses.law.1.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85" },
      { title: t("courses.law.2.title"), program: t("courses.law.2.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87" },
      { title: t("courses.law.3.title"), program: t("courses.law.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
    ],
    management: [
      { title: t("courses.management.0.title"), program: t("courses.management.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
      { title: t("courses.management.1.title"), program: t("courses.management.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
      { title: t("courses.management.2.title"), program: t("courses.management.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.management.3.title"), program: t("courses.management.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
    entrepreneurship: [
      { title: t("courses.entrepreneurship.0.title"), program: t("courses.entrepreneurship.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.entrepreneurship.1.title"), program: t("courses.entrepreneurship.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.entrepreneurship.2.title"), program: t("courses.entrepreneurship.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" },
      { title: t("courses.entrepreneurship.3.title"), program: t("courses.entrepreneurship.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
  };

  const active = coursesData[activeTab];

  return (
    <section className="csl-root">
      <div className="csl-inner">

        {/* Header */}
        <div className="csl-header">
          <div>
            <p className="csl-eyebrow">Catalogue</p>
            <h2 className="csl-h2">
              {t("courses.title") || <>Nos <em>formations</em></>}
            </h2>
            <p className="csl-subtitle">
              {t("courses.subtitle") ||
                "Des programmes reconnus, accessibles en ligne, pour faire avancer votre carrière."}
            </p>
          </div>
          <span className="csl-count">{active.length} cours</span>
        </div>

        {/* Tabs */}
        <div className="csl-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`csl-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="csl-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {active.map((course, i) => (
              <CourseCard
                key={i}
                course={course}
                index={i}
                ctaLabel={t("courses.viewDetail") || "Voir le cours"}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}