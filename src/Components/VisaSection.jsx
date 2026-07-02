import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  ClipboardList,
  CreditCard,
  FolderOpen,
  Send,
  RefreshCw,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  Plane,
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  Copy,
  CheckCheck,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

/* ─── Design tokens ─── */
const INK       = "#1B1A16";
const PAPER     = "#F6F1E2";
const PAPER_DEEP= "#EBE2C9";
const GREEN     = "#0B4F3C";   // obtain accent
const COPPER    = "#B5651D";   // obtain accent 2
const NAVY      = "#1A3558";   // renewal accent
const STEEL     = "#3B6E8F";   // renewal accent 2
const LINE      = "rgba(27,26,22,0.16)";

/* ─── Contact info ─── */
const CONTACT = {
  email:   "visa@h-learning.zm",
  phone:   "+260 97 123 4567",
  address: "Cairo Road, Plot 12B, Lusaka, Zambia",
  hours:   "Lun – Ven, 08h00 – 17h00 CAT",
};

/* ─── Guilloche background ─── */
const guilloche = (a, b) => ({
  backgroundImage: `
    repeating-linear-gradient(115deg, ${a}08 0px, ${a}08 1px, transparent 1px, transparent 9px),
    repeating-linear-gradient(25deg,  ${b}08 0px, ${b}08 1px, transparent 1px, transparent 9px)
  `,
});

/* ─── Steps data ─── */
const STEPS_OBTAIN = [
  { no:"01", icon: FileText,    rotate:-1.4,
    labelKey:"visaObtain.step1.label", titleKey:"visaObtain.step1.title", descKey:"visaObtain.step1.desc",
    detailKeys:["visaObtain.step1.d1","visaObtain.step1.d2","visaObtain.step1.d3"],
    stat:"4", statLabelKey:"visaObtain.step1.stat" },
  { no:"02", icon: ClipboardList, rotate:1.2,
    labelKey:"visaObtain.step2.label", titleKey:"visaObtain.step2.title", descKey:"visaObtain.step2.desc",
    detailKeys:["visaObtain.step2.d1","visaObtain.step2.d2","visaObtain.step2.d3"],
    stat:"15min", statLabelKey:"visaObtain.step2.stat" },
  { no:"03", icon: CreditCard,  rotate:-1.1,
    labelKey:"visaObtain.step3.label", titleKey:"visaObtain.step3.title", descKey:"visaObtain.step3.desc",
    detailKeys:["visaObtain.step3.d1","visaObtain.step3.d2","visaObtain.step3.d3"],
    stat:"100%", statLabelKey:"visaObtain.step3.stat" },
  { no:"04", icon: FileText,    rotate:1.5,
    labelKey:"visaObtain.step4.label", titleKey:"visaObtain.step4.title", descKey:"visaObtain.step4.desc",
    detailKeys:["visaObtain.step4.d1","visaObtain.step4.d2","visaObtain.step4.d3"],
    stat:"48h", statLabelKey:"visaObtain.step4.stat" },
];

const STEPS_RENEWAL = [
  { no:"01", icon: FolderOpen,  rotate:-1.6,
    labelKey:"visaRenewal.step1.label", titleKey:"visaRenewal.step1.title", descKey:"visaRenewal.step1.desc",
    detailKeys:["visaRenewal.step1.d1","visaRenewal.step1.d2","visaRenewal.step1.d3"],
    stat:"30j", statLabelKey:"visaRenewal.step1.stat" },
  { no:"02", icon: Send,        rotate:1.3,
    labelKey:"visaRenewal.step2.label", titleKey:"visaRenewal.step2.title", descKey:"visaRenewal.step2.desc",
    detailKeys:["visaRenewal.step2.d1","visaRenewal.step2.d2","visaRenewal.step2.d3"],
    stat:"15min", statLabelKey:"visaRenewal.step2.stat" },
  { no:"03", icon: CreditCard,  rotate:-0.9,
    labelKey:"visaRenewal.step3.label", titleKey:"visaRenewal.step3.title", descKey:"visaRenewal.step3.desc",
    detailKeys:["visaRenewal.step3.d1","visaRenewal.step3.d2","visaRenewal.step3.d3"],
    stat:"100%", statLabelKey:"visaRenewal.step3.stat" },
  { no:"04", icon: RefreshCw,   rotate:1.7,
    labelKey:"visaRenewal.step4.label", titleKey:"visaRenewal.step4.title", descKey:"visaRenewal.step4.desc",
    detailKeys:["visaRenewal.step4.d1","visaRenewal.step4.d2","visaRenewal.step4.d3"],
    stat:"48h", statLabelKey:"visaRenewal.step4.stat" },
];

/* ════════════════════════════════════════════
   Contact Modal
═══════════════════════════════════════════════ */
function ContactModal({ open, onClose, mode }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(null);
  const accent  = mode === "obtain" ? GREEN : NAVY;
  const accent2 = mode === "obtain" ? COPPER : STEEL;

  const copy = (val, key) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const rows = [
    { key:"email",   icon: Mail,    label:"Email",   val: CONTACT.email,   href:`mailto:${CONTACT.email}` },
    { key:"phone",   icon: Phone,   label:"Téléphone", val: CONTACT.phone, href:`tel:${CONTACT.phone.replace(/\s/g,"")}` },
    { key:"address", icon: MapPin,  label:"Adresse", val: CONTACT.address, href: null },
    { key:"hours",   icon: Clock,   label:"Horaires", val: CONTACT.hours,  href: null },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(27,26,22,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 w-full sm:w-[460px]"
            style={{ ...guilloche(accent, accent2) }}
          >
            <div
              className="relative overflow-hidden"
              style={{ background: PAPER, border: `1.5px dashed ${LINE}` }}
            >
              {/* flag stripe */}
              <div className="flex h-[5px]">
                <div className="flex-1" style={{ background: accent }} />
                <div className="flex-1" style={{ background: accent2 }} />
                <div className="flex-1" style={{ background: "#9B1B30" }} />
                <div className="flex-1" style={{ background: INK }} />
              </div>

              <div className="px-6 pt-5 pb-6">
                {/* header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: accent }}>
                      {mode === "obtain" ? t("visaObtain.eyebrow") : t("visaRenewal.eyebrow")}
                    </p>
                    <h3 className="text-[20px] leading-snug" style={{ fontFamily: "var(--font-display)", color: INK }}>
                      {mode === "obtain"
                        ? "Contactez-nous pour votre visa"
                        : "Contactez-nous pour le renouvellement"}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 w-8 h-8 flex items-center justify-center mt-0.5 transition-opacity hover:opacity-60"
                    style={{ border: `1px dashed ${LINE}`, color: INK }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* info rows */}
                <div className="flex flex-col gap-2.5 mb-6">
                  {rows.map(({ key, icon: Icon, label, val, href }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 px-3.5 py-3"
                      style={{ border: `1px dashed ${LINE}` }}
                    >
                      <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Icon size={13} style={{ color: accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.1em] mb-0.5" style={{ color: "rgba(27,26,22,0.45)" }}>
                          {label}
                        </p>
                        {href ? (
                          <a href={href} className="text-[13px] hover:opacity-70 transition-opacity" style={{ color: INK }}>
                            {val}
                          </a>
                        ) : (
                          <p className="text-[13px]" style={{ color: INK }}>{val}</p>
                        )}
                      </div>
                      {(key === "email" || key === "phone") && (
                        <button
                          onClick={() => copy(val, key)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center transition-opacity hover:opacity-60"
                          style={{ color: copied === key ? accent : "rgba(27,26,22,0.4)" }}
                        >
                          {copied === key ? <CheckCheck size={13} /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* direct email CTA */}
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                    mode === "obtain" ? "Demande de visa Zambie" : "Renouvellement de visa Zambie"
                  )}`}
                  className="flex items-center justify-center gap-2 text-[13px] font-medium py-3 w-full transition-opacity hover:opacity-85"
                  style={{ background: INK, color: PAPER }}
                >
                  <Mail size={13} />
                  Envoyer un email
                  <ArrowRight size={13} />
                </a>

                {/* seal */}
                <div
                  className="absolute bottom-4 right-5 w-14 h-14 rounded-full flex items-center justify-center pointer-events-none"
                  style={{ border: `1.5px solid ${accent2}`, color: accent2, transform:"rotate(-14deg)", opacity:0.4 }}
                >
                  <span className="font-mono text-[7px] font-bold uppercase tracking-[0.05em] text-center leading-tight">
                    Officiel
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   Stamp card (step)
═══════════════════════════════════════════════ */
function StampCard({ step, index, t, accent, accent2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const cardAccent = index % 2 === 0 ? accent : accent2;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26, rotate: 0 }}
      animate={inView ? { opacity: 1, y: 0, rotate: step.rotate } : {}}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
      whileHover={{ rotate: 0, y: -4, transition: { duration: 0.22 } }}
      className="relative flex-1 min-w-[200px]"
      style={{
        background: PAPER,
        border: `1.5px dashed ${LINE}`,
        boxShadow: "0 10px 24px -12px rgba(27,26,22,0.18)",
      }}
    >
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-mono text-[11px] tracking-[0.08em] px-1.5 py-0.5 border"
            style={{ color: cardAccent, borderColor: cardAccent }}
          >
            Nº {step.no}
          </span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${cardAccent}18` }}>
            <Icon size={15} style={{ color: cardAccent }} />
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: cardAccent }}>
          {t(step.labelKey)}
        </p>
        <h3 className="text-[18px] leading-[1.25] mb-2" style={{ fontFamily: "var(--font-display)", color: INK }}>
          {t(step.titleKey)}
        </h3>
        <p className="text-[12.5px] leading-[1.65] mb-4" style={{ color: "rgba(27,26,22,0.62)" }}>
          {t(step.descKey)}
        </p>

        <ul className="flex flex-col gap-1.5 mb-5">
          {step.detailKeys.map((key) => (
            <li key={key} className="flex items-start gap-2 text-[11.5px]" style={{ color: "rgba(27,26,22,0.72)" }}>
              <span className="mt-[6px] w-1 h-1 rounded-full shrink-0" style={{ background: cardAccent }} />
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="pt-3 flex items-baseline justify-between" style={{ borderTop: `1px dashed ${LINE}` }}>
          <span className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(27,26,22,0.4)" }}>
            {t(step.statLabelKey)}
          </span>
          <span className="font-mono text-[18px] font-semibold" style={{ color: INK }}>
            {step.stat}
          </span>
        </div>
      </div>

      {/* perforation notches */}
      <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full" style={{ background: PAPER_DEEP }} />
      <div className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full" style={{ background: PAPER_DEEP }} />
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Visa / Renewal sticker mockup
═══════════════════════════════════════════════ */
function VisaSticker({ mode, t }) {
  const isObtain = mode === "obtain";
  const accent   = isObtain ? GREEN : NAVY;
  const accent2  = isObtain ? COPPER : STEEL;
  const prefix   = isObtain ? "visaObtain" : "visaRenewal";
  const ModeIcon = isObtain ? Plane : RefreshCw;

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, rotate: -8, y: 20 }}
      animate={{ opacity: 1, rotate: -3, y: 0 }}
      exit={{ opacity: 0, rotate: 4, y: -10 }}
      transition={{ duration: 0.5, ease }}
      className="relative w-full max-w-[280px] mx-auto"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: PAPER,
          border: `1.5px dashed ${LINE}`,
          boxShadow: "0 28px 60px -18px rgba(27,26,22,0.35)",
          ...guilloche(accent, accent2),
        }}
      >
        {/* flag stripe */}
        <div className="flex h-[5px]">
          <div className="flex-1" style={{ background: accent }} />
          <div className="flex-1" style={{ background: accent2 }} />
          <div className="flex-1" style={{ background: "#9B1B30" }} />
          <div className="flex-1" style={{ background: INK }} />
        </div>

        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ModeIcon size={12} style={{ color: accent }} />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: accent }}>
                Republic of Zambia
              </span>
            </div>
            <ShieldCheck size={14} style={{ color: accent2 }} />
          </div>

          <p className="font-mono text-[8px] uppercase tracking-[0.14em] mb-0.5" style={{ color: "rgba(27,26,22,0.45)" }}>
            {t(`${prefix}.mock.subtitle`)}
          </p>
          <h3 className="text-[16px] leading-snug mb-3" style={{ fontFamily: "var(--font-display)", color: INK }}>
            {t(`${prefix}.mock.course`)}
          </h3>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {[
              { label: t(`${prefix}.mock.date`),  val: "29 JUN 2026" },
              { label: t(`${prefix}.mock.score`), val: isObtain ? "30 DAYS" : "+60 DAYS" },
            ].map(({ label, val }) => (
              <div key={label} className="px-2 py-1.5" style={{ border: `1px dashed ${LINE}` }}>
                <p className="text-[8px] uppercase tracking-[0.08em] mb-0.5" style={{ color: "rgba(27,26,22,0.4)" }}>{label}</p>
                <p className="font-mono text-[11px]" style={{ color: INK }}>{val}</p>
              </div>
            ))}
          </div>

          <p className="font-mono text-[9px] tracking-[0.06em] mb-0.5" style={{ color: "rgba(27,26,22,0.5)" }}>
            {t(`${prefix}.mock.recipient`).toUpperCase()}
          </p>
          <p className="font-mono text-[10px] tracking-[0.1em] mb-3" style={{ color: INK }}>
            ALEX&lt;&lt;LAURENT&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </p>

          <div className="flex items-center gap-1 mb-3">
            <Check size={11} style={{ color: accent }} />
            <span className="text-[10px]" style={{ color: accent }}>{t(`${prefix}.mock.verified`)}</span>
          </div>

          <div
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium"
            style={{ background: INK, color: PAPER }}
          >
            <ModeIcon size={11} />
            {t(`${prefix}.mock.download`)}
          </div>
        </div>

        {/* wax seal */}
        <div
          className="absolute bottom-4 right-3 w-12 h-12 rounded-full flex items-center justify-center pointer-events-none"
          style={{ border: `1.5px solid ${accent2}`, color: accent2, transform:"rotate(-18deg)", opacity:0.5 }}
        >
          <span className="font-mono text-[6.5px] font-bold uppercase tracking-[0.04em] text-center leading-tight px-1">
            {t(`${prefix}.mock.withDistinction`)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Main export — VisaSection
═══════════════════════════════════════════════ */
export default function VisaSection() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("obtain");   // "obtain" | "renewal"
  const [contactOpen, setContactOpen] = useState(false);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const isObtain = mode === "obtain";
  const accent   = isObtain ? GREEN  : NAVY;
  const accent2  = isObtain ? COPPER : STEEL;
  const steps    = isObtain ? STEPS_OBTAIN : STEPS_RENEWAL;
  const prefix   = isObtain ? "visaObtain"  : "visaRenewal";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root { --font-display: 'Fraunces', serif; }
      `}</style>

      <section
        className="relative py-16 sm:py-28 overflow-hidden"
        style={{ background: PAPER, ...guilloche(accent, accent2) }}
      >
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 relative z-10">

          {/* ── MODE TOGGLE ── */}
          <div className="flex justify-center mb-12 sm:mb-16">
            <div
              className="flex p-1 gap-1"
              style={{ border: `1.5px dashed ${LINE}`, background: PAPER_DEEP }}
            >
              {[
                { key: "obtain",  label: isObtain ? t("visaObtain.eyebrow") : t("visaObtain.eyebrow"), icon: Plane },
                { key: "renewal", label: t("visaRenewal.eyebrow"),  icon: RefreshCw },
              ].map(({ key, label, icon: Icon }) => {
                const active = mode === key;
                const btnAccent = key === "obtain" ? GREEN : NAVY;
                return (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className="flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-all duration-200"
                    style={{
                      background: active ? INK : "transparent",
                      color: active ? PAPER : "rgba(27,26,22,0.5)",
                    }}
                  >
                    <Icon size={12} style={{ color: active ? PAPER : btnAccent }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── HEADER ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38, ease }}
              ref={headerRef}
              className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center mb-14 sm:mb-20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                  {isObtain ? <Plane size={12} /> : <RefreshCw size={12} />}
                  {t(`${prefix}.eyebrow`)}
                  <span style={{ color: "rgba(27,26,22,0.28)" }}>· République de Zambie</span>
                </div>

                <h2
                  className="text-[36px] sm:text-[50px] lg:text-[60px] leading-[1.04] tracking-[-0.02em] mb-5"
                  style={{ fontFamily: "var(--font-display)", color: INK }}
                >
                  {t(`${prefix}.title1`)}
                  <br />
                  <span style={{ color: accent }}>{t(`${prefix}.title2`)}</span>
                </h2>

                <p className="text-[15px] leading-[1.75] max-w-[440px] mb-7" style={{ color: "rgba(27,26,22,0.65)" }}>
                  {t(`${prefix}.subtitle`)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: ShieldCheck, key: "trust.recognized" },
                    { icon: Sparkles,    key: "trust.ai" },
                    { icon: isObtain ? Plane : RefreshCw, key: "trust.instant" },
                  ].map(({ icon: Icon, key }) => (
                    <span
                      key={key}
                      className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.05em] px-3 py-1.5"
                      style={{ border: `1px dashed ${LINE}`, color: "rgba(27,26,22,0.58)" }}
                    >
                      <Icon size={11} style={{ color: accent2 }} />
                      {t(`${prefix}.${key}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                <AnimatePresence mode="wait">
                  <VisaSticker key={mode} mode={mode} t={t} />
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── STEP DIVIDER ── */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(27,26,22,0.4)" }}>
              {t(`${prefix}.stepsLabel`)}
            </span>
            <div className="flex-1 h-px" style={{ background: LINE }} />
            <span className="font-mono text-[11px]" style={{ color: "rgba(27,26,22,0.3)" }}>
              4 {t(`${prefix}.stepsCount`)}
            </span>
          </div>

          {/* ── STEP CARDS ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-steps"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
              className="flex flex-col sm:flex-row gap-6 sm:gap-4 mb-16 sm:mb-20"
            >
              {steps.map((step, i) => (
                <StampCard key={step.no} step={step} index={i} t={t} accent={accent} accent2={accent2} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── CTA ── */}
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="relative overflow-hidden px-6 sm:px-10 py-9 sm:py-12"
            style={{ background: INK }}
          >
            {/* decorative ring */}
            <div
              className="absolute -right-8 -top-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ border: `10px solid ${accent2}`, opacity: 0.1 }}
            />
            <div
              className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full pointer-events-none"
              style={{ border: `10px solid ${accent}`, opacity: 0.08 }}
            />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-2.5" style={{ color: accent2 }}>
                  {t(`${prefix}.cta.eyebrow`)}
                </p>
                <p className="text-[22px] sm:text-[27px] leading-snug max-w-md" style={{ fontFamily:"var(--font-display)", color: PAPER }}>
                  {t(`${prefix}.cta.title`)}
                </p>
              </div>

              <button
                onClick={() => setContactOpen(true)}
                className="group flex items-center gap-2 text-[14px] font-medium px-7 py-3.5 shrink-0 transition-opacity hover:opacity-85 active:scale-[0.97]"
                style={{ background: accent2, color: INK }}
              >
                {t(`${prefix}.cta.btn`)}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── CONTACT MODAL ── */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} mode={mode} />
    </>
  );
}