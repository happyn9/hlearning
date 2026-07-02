import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const STEPS = [
  { id: "Beginner",     emoji: "🌱", color: "#10B981", glow: "rgba(16,185,129,0.3)" },
  { id: "Intermediate", emoji: "🔥", color: "#6366F1", glow: "rgba(99,102,241,0.3)" },
  { id: "Advanced",     emoji: "⚡", color: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
];

const CARDS = [
  {
    key: "pdf",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "#F87171",
    bg: "rgba(248,113,113,0.08)",
  },
  {
    key: "video",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
  },
  {
    key: "notes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "#34D399",
    bg: "rgba(52,211,153,0.08)",
  },
];

const avatarLeft  = "https://i.pinimg.com/1200x/15/e1/84/15e1844da2ab31663a95513728413d0e.jpg";
const avatarRight = "https://i.pinimg.com/736x/75/84/9d/75849d706be1d5137f440f1d80897d89.jpg";

export default function Tuition() {
  const { t } = useTranslation();
  const [active, setActive]       = useState("Beginner");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const activeStep = STEPS.find((s) => s.id === active);

  return (
    <>
      <section
        style={{
          background: "linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
        }}
        className="relative py-10 overflow-hidden"
      >
        {/* Ambient blobs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }}
        />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* ── HEADER ── */}
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: "rgba(99,102,241,0.15)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              {t("tuition.header.tag")}
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              {t("tuition.header.title")}
            </h2>

            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              {t("tuition.header.subtitle")}
            </p>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">

            {/* Level tabs */}
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1">
              {STEPS.map((step) => {
                const isActive = step.id === active;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActive(step.id)}
                    style={
                      isActive
                        ? {
                            background: `rgba(255,255,255,0.06)`,
                            borderColor: step.color,
                            boxShadow: `0 0 18px ${step.glow}`,
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.08)",
                          }
                    }
                    className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border min-w-max transition-all duration-300 group"
                  >
                    {/* glow dot */}
                    <span style={{ color: isActive ? step.color : "#64748B" }}>
                      {step.id === "Beginner" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : step.id === "Intermediate" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>

                    <div className="text-left">
                      <p
                        className="text-xs font-semibold tracking-wide uppercase"
                        style={{ color: isActive ? step.color : "#64748B" }}
                      >
                        {t(`tuition.steps.${step.id}.label`)}
                      </p>
                    </div>

                    {isActive && (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
                        style={{ background: step.color, boxShadow: `0 0 8px ${step.color}` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(20px)",
                }}
                className="rounded-3xl p-6 sm:p-8"
              >
                {/* Chat bubbles */}
                <div className="mb-8 space-y-4">
                  {/* Left bubble */}
                  <div className="flex items-end gap-3 max-w-sm">
                    <img
                      src={avatarLeft}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-2"
                      style={{ ringColor: activeStep.color }}
                    />
                    <div>
                      <div
                        className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm font-medium leading-relaxed"
                        style={{ background: "#FCD34D", color: "#0F172A" }}
                      >
                        {t(`tuition.steps.${active}.leftBubble`)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 ml-1">{t("tuition.example")}</p>
                    </div>
                  </div>

                  {/* Right bubble */}
                  <div className="flex items-end gap-3 max-w-sm ml-auto flex-row-reverse">
                    <img
                      src={avatarRight}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-indigo-400"
                    />
                    <div
                      className="px-4 py-3 rounded-2xl rounded-br-sm text-sm font-medium leading-relaxed text-white"
                      style={{ background: "rgba(99,102,241,0.5)", border: "1px solid rgba(99,102,241,0.4)" }}
                    >
                      {t(`tuition.steps.${active}.rightBubble`)}
                    </div>
                  </div>
                </div>

                {/* Method cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {CARDS.map((card) => (
                    <div
                      key={card.key}
                      style={{
                        background: card.bg,
                        border: `1px solid ${card.accent}22`,
                      }}
                      className="rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                    >
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${card.accent}18`, color: card.accent }}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {t(`tuition.cards.${card.key}.title`)}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {t(`tuition.cards.${card.key}.desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setOpenModal(true)}
                    style={{
                      background: `linear-gradient(135deg, ${activeStep.color}, #6366F1)`,
                      boxShadow: `0 8px 32px ${activeStep.glow}`,
                    }}
                    className="text-white font-bold px-10 py-3.5 rounded-full text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:opacity-90"
                  >
                    {t("tuition.cta")}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close */}
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Header */}
              <div className="p-8 pb-6 text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: `${activeStep.color}18`, color: activeStep.color }}>
                  {active === "Beginner" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active === "Intermediate" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span
                  className="block text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: activeStep.color }}
                >
                  {t(`tuition.steps.${active}.label`)}
                </span>
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  {t(`tuition.steps.${active}.title`)}
                </h3>
                <p className="text-slate-400 text-sm">
                  Structured lessons based on real conversations. PDFs, videos & notes included.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px mx-8" style={{ background: "rgba(255,255,255,0.07)" }} />

              {/* Body */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm line-through">$49</p>
                    <p
                      className="text-3xl font-extrabold"
                      style={{ color: activeStep.color }}
                    >
                      Up to 50% OFF
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/tuition/learning")}
                    style={{
                      background: `linear-gradient(135deg, ${activeStep.color}, #6366F1)`,
                      boxShadow: `0 8px 24px ${activeStep.glow}`,
                    }}
                    className="text-white font-bold px-7 py-3 rounded-xl text-sm hover:opacity-90 hover:scale-105 transition-all duration-200"
                  >
                    {t("tuition.continue")}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500">
                  No credit card required · Cancel anytime
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}