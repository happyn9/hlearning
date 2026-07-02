import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FolderOpen,
  Send,
  CreditCard,
  StampIcon as Stamp,
  ArrowRight,
  CheckCircle2,
  Star,
  Award,
  Sparkles,
  Shield,
  RefreshCw,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

/* ─── Steps data ─── */
const STEPS = [
  {
    id: 1,
    icon: FolderOpen,
    imageSrc: "https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=85&auto=format&fit=crop",
    imageAlt: "Préparation du dossier de renouvellement",
    accentBg: "#EDE9FE",
    accentText: "#5B21B6",
    accentDot: "#7C3AED",
    iconColor: "#7C3AED",
    labelKey: "visaRenewal.step1.label",
    titleKey: "visaRenewal.step1.title",
    descKey: "visaRenewal.step1.desc",
    detailKeys: ["visaRenewal.step1.d1", "visaRenewal.step1.d2", "visaRenewal.step1.d3"],
    stat: "30j",
    statLabelKey: "visaRenewal.step1.stat",
  },
  {
    id: 2,
    icon: Send,
    imageSrc: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85&auto=format&fit=crop",
    imageAlt: "Soumission de la demande de renouvellement",
    accentBg: "#E0F2FE",
    accentText: "#075985",
    accentDot: "#0284C7",
    iconColor: "#0284C7",
    labelKey: "visaRenewal.step2.label",
    titleKey: "visaRenewal.step2.title",
    descKey: "visaRenewal.step2.desc",
    detailKeys: ["visaRenewal.step2.d1", "visaRenewal.step2.d2", "visaRenewal.step2.d3"],
    stat: "15min",
    statLabelKey: "visaRenewal.step2.stat",
  },
  {
    id: 3,
    icon: CreditCard,
    imageSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85&auto=format&fit=crop",
    imageAlt: "Paiement des frais de renouvellement",
    accentBg: "#FEF3C7",
    accentText: "#92400E",
    accentDot: "#D97706",
    iconColor: "#D97706",
    labelKey: "visaRenewal.step3.label",
    titleKey: "visaRenewal.step3.title",
    descKey: "visaRenewal.step3.desc",
    detailKeys: ["visaRenewal.step3.d1", "visaRenewal.step3.d2", "visaRenewal.step3.d3"],
    stat: "100%",
    statLabelKey: "visaRenewal.step3.stat",
  },
  {
    id: 4,
    icon: RefreshCw,
    imageSrc: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=900&q=85&auto=format&fit=crop",
    imageAlt: "Visa renouvelé récupéré",
    accentBg: "#D1FAE5",
    accentText: "#065F46",
    accentDot: "#059669",
    iconColor: "#059669",
    labelKey: "visaRenewal.step4.label",
    titleKey: "visaRenewal.step4.title",
    descKey: "visaRenewal.step4.desc",
    detailKeys: ["visaRenewal.step4.d1", "visaRenewal.step4.d2", "visaRenewal.step4.d3"],
    stat: "48h",
    statLabelKey: "visaRenewal.step4.stat",
  },
];

function Connector({ from }) {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex flex-col items-center gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-px h-2 rounded-full"
            style={{ background: from.accentDot, opacity: 0.3 + i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function StepRow({ step, index, t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;
  const isEven = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: 0.1 }}
      className={`group relative flex flex-col sm:flex-row ${isEven ? "sm:flex-row-reverse" : ""} rounded-3xl overflow-hidden border border-stone-100 bg-white`}
    >
      <div
        className="pointer-events-none select-none absolute bottom-0 right-4 sm:right-6 text-[100px] sm:text-[160px] font-bold leading-none text-stone-950"
        style={{ opacity: 0.03 }}
      >
        {step.id}
      </div>

      <div className="w-full sm:w-[44%] shrink-0 overflow-hidden relative h-[220px] sm:h-auto sm:min-h-[320px]">
        <img
          src={step.imageSrc}
          alt={step.imageAlt}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
        />
        <div
          className={`absolute inset-0 ${isEven ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-white/0 via-white/0 to-white/20`}
        />
        <div className="absolute top-4 left-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold"
            style={{ background: step.accentBg, color: step.accentText }}
          >
            {step.id}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 sm:px-10 py-8 sm:py-10 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: step.accentBg }}
            >
              <Icon size={18} style={{ color: step.iconColor }} />
            </div>
            <span
              className="text-[11px] font-semibold tracking-[0.07em] uppercase px-3 py-1.5 rounded-full"
              style={{ background: step.accentBg, color: step.accentText }}
            >
              {t(step.labelKey)}
            </span>
          </div>

          <h3 className="text-[22px] sm:text-[26px] font-semibold text-stone-950 tracking-[-0.025em] leading-[1.2] mb-3">
            {t(step.titleKey)}
          </h3>

          <p className="text-[14px] sm:text-[15px] text-stone-500 leading-[1.7] mb-6 max-w-[400px]">
            {t(step.descKey)}
          </p>

          <ul className="flex flex-col gap-3">
            {step.detailKeys.map((key) => (
              <li key={key} className="flex items-start gap-3 text-[13px] sm:text-[14px] text-stone-600">
                <CheckCircle2
                  size={15}
                  className="shrink-0 mt-0.5"
                  style={{ color: step.iconColor }}
                />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 pt-5 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[12px] sm:text-[13px] text-stone-400">{t(step.statLabelKey)}</span>
          <span
            className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.03em]"
            style={{ color: step.iconColor }}
          >
            {step.stat}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Visa mockup card ─── */
function VisaMockup({ t }) {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-violet-200 rounded-[40px] blur-2xl opacity-30 pointer-events-none" />

      <div className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden w-full max-w-[340px] mx-auto shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)]">
        <div className="bg-stone-950 px-6 pt-7 pb-12 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-violet-600 opacity-15" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-violet-400 opacity-10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <RefreshCw size={14} className="text-white" />
              </div>
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-violet-300">Zambia Visa Renewal</span>
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-[0.12em] mb-2">{t("visaRenewal.mock.subtitle")}</p>
            <h3 className="text-[17px] font-semibold text-white tracking-tight leading-snug">{t("visaRenewal.mock.course")}</h3>
          </div>
        </div>

        <div className="px-5 mt-2 pb-5">
          <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 px-4 py-3 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-[12px] font-bold text-violet-700 shrink-0">AL</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-stone-900 truncate">Alex Laurent</p>
              <p className="text-[11px] text-stone-400">{t("visaRenewal.mock.recipient")}</p>
            </div>
            <Shield size={18} className="text-violet-500 shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-stone-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-stone-400 mb-0.5">{t("visaRenewal.mock.date")}</p>
              <p className="text-[13px] font-semibold text-stone-800">Juin 2026</p>
            </div>
            <div className="bg-stone-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-stone-400 mb-0.5">{t("visaRenewal.mock.score")}</p>
              <p className="text-[13px] font-semibold text-stone-800">30 jours</p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
            ))}
            <span className="text-[11px] text-stone-400 ml-1.5">{t("visaRenewal.mock.withDistinction")}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 mb-4">
            <Shield size={13} className="text-emerald-500 shrink-0" />
            <span className="text-[12px] text-emerald-700 font-medium">{t("visaRenewal.mock.verified")}</span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-stone-950 text-white text-[13px] font-medium py-3 rounded-full hover:bg-stone-800 transition-colors cursor-pointer">
            <Stamp size={14} />
            {t("visaRenewal.mock.download")}
          </button>
        </div>
      </div>
    </div>
  );
}

function VisaRenewalSection({ onGetStarted }) {
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-16 sm:py-28 border-t border-stone-100 overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">

        <div ref={headerRef} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start mb-14 sm:mb-20">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease }}
              className="flex items-center gap-2.5 mb-6"
            >
              <span className="w-6 h-px bg-stone-300" />
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-stone-400">{t("visaRenewal.eyebrow")}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="text-[36px] sm:text-[48px] lg:text-[58px] font-semibold leading-[1.02] tracking-[-0.035em] text-stone-950 mb-5"
            >
              {t("visaRenewal.title1")}
              <br />
              <span className="text-violet-600">{t("visaRenewal.title2")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease, delay: 0.2 }}
              className="text-[15px] sm:text-[16px] text-stone-500 leading-[1.75] max-w-[420px] mb-7"
            >
              {t("visaRenewal.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: Shield, labelKey: "visaRenewal.trust.recognized" },
                { icon: Sparkles, labelKey: "visaRenewal.trust.ai" },
                { icon: Award, labelKey: "visaRenewal.trust.instant" },
              ].map(({ icon: Icon, labelKey }) => (
                <span key={labelKey} className="flex items-center gap-1.5 text-[12px] text-stone-500 border border-stone-200 bg-stone-50 rounded-full px-3.5 py-1.5">
                  <Icon size={12} className="text-stone-400" />
                  {t(labelKey)}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 10 }} animate={headerInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.25 }}
            className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end"
          >
            <VisaMockup t={t} />
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.1em] whitespace-nowrap">{t("visaRenewal.stepsLabel")}</span>
          <div className="flex-1 h-px bg-stone-100" />
          <span className="text-[11px] text-stone-300 font-medium whitespace-nowrap">4 {t("visaRenewal.stepsCount")}</span>
        </div>

        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <StepRow step={step} index={i} t={t} />
              {i < STEPS.length - 1 && <Connector from={step} />}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 28 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl bg-stone-950 px-6 sm:px-10 py-8 sm:py-10"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-700 opacity-10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-violet-500 opacity-8 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-violet-400 mb-2">{t("visaRenewal.cta.eyebrow")}</p>
              <p className="text-[20px] sm:text-[24px] font-semibold text-white tracking-[-0.02em] leading-snug max-w-sm">{t("visaRenewal.cta.title")}</p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
              <div className="flex -space-x-2.5">
                {[
                  { bg: "#7C3AED", init: "AL" },
                  { bg: "#0284C7", init: "MR" },
                  { bg: "#D97706", init: "JK" },
                  { bg: "#059669", init: "SC" },
                ].map(({ bg, init }) => (
                  <div
                    key={init}
                    style={{ background: bg }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[2.5px] border-stone-950 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white"
                  >
                    {init}
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-[13px] sm:text-[14px] font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-colors cursor-pointer"
              >
                {t("visaRenewal.cta.btn")}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default VisaRenewalSection;