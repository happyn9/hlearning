import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Tag, Globe, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  {
    icon: Tag,
    titleKey: "why.items.free.title",
    descKey: "why.items.free.desc",
    accent: "#3730A3",
    accentBg: "#EEF2FF",
    accentText: "#4338CA",
    stat: "Free",
    statLabel: "Always",
  },
  {
    icon: Globe,
    titleKey: "why.items.flexible.title",
    descKey: "why.items.flexible.desc",
    accent: "#0F766E",
    accentBg: "#F0FDFA",
    accentText: "#0D9488",
    stat: "24/7",
    statLabel: "Access",
  },
  {
    icon: Award,
    titleKey: "why.items.certificate.title",
    descKey: "why.items.certificate.desc",
    accent: "#B45309",
    accentBg: "#FFFBEB",
    accentText: "#D97706",
    stat: "100%",
    statLabel: "Recognized",
  },
];

function WhyCard({ item, index }) {
  const { t } = useTranslation();
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.12, duration: 0.45, ease: "easeOut" }}
      className="relative bg-white rounded-2xl p-8 border border-slate-200 overflow-hidden group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      {/* Top accent line — always visible, colored per item */}
      <div className="absolute top-0 left-8 right-8 h-0.3 rounded-b" style={{ background: item.accent }} />

      {/* Stat + icon row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: item.accent,
            }}
          >
            {item.stat}
          </p>
          <p className="font-bold tracking-widest mt-1" style={{ color: item.accentText, opacity: 0.6 }}>
            {item.statLabel}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200"
          style={{ background: item.accentBg }}
        >
          <Icon className="w-5 h-5" style={{ color: item.accent }} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-6" />

      <h1 className="font-semibold text-slate-800 mb-3 tracking-tight">
        {t(item.titleKey)}
      </h1>
      <p className="text-slate-500 leading-relaxed">
        {t(item.descKey)}
      </p>
    </motion.div>
  );
}

export default function WhyChooseSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-28 px-6"
      style={{ background: "#F7F6F3", fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="mb-14"
        >
          <p className="text-[11px] font-bold tracking-[.12em] uppercase text-indigo-700 mb-3">
            Why us
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#1E1B4B" }}>
              {t("why.title")}
            </h2>
            <p className="text-[14px] text-slate-400 max-w-xs sm:text-right leading-relaxed">
              Built for learners who need flexibility without compromising on quality.
            </p>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <WhyCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { value: "12,000+", label: "Enrolled students" },
            { value: "98%", label: "Completion rate" },
            { value: "4.9 / 5", label: "Average rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[22px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>{s.value}</p>
              <p className="text-[12px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}