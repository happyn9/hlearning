import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

/* Same token system as Hero.jsx — keep both files in sync if you tweak colors. */
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const COLORS = {
  ink: "#12141C",
  paper: "#FAF9F5",
  mint: "#5EEAD4",
  pink: "#F472B6",
  amber: "#FBBF24",
  slate: "#7C8394",
};

/* Difficulty expressed the way a coding platform actually expresses it:
   a filled-dot meter, not a generic badge — order carries real meaning here. */
const STEPS = [
  { id: "Beginner", dots: 1, color: COLORS.mint },
  { id: "Intermediate", dots: 2, color: COLORS.pink },
  { id: "Advanced", dots: 3, color: COLORS.amber },
];

const CARDS = [
  {
    key: "pdf",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.pink,
  },
  {
    key: "video",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.amber,
  },
  {
    key: "notes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.mint,
  },
];

function DotMeter({ count, color }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: i < count ? color : "rgba(18,20,28,0.12)" }}
        />
      ))}
    </div>
  );
}

export default function Tuition() {
  const { t } = useTranslation();
  const [active, setActive] = useState("Beginner");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const activeStep = STEPS.find((s) => s.id === active);

  return (
    <>
      <section className="relative py-24 overflow-hidden" style={{ background: COLORS.paper }}>
        {/* ambient glow, quiet — the terminal chrome does the talking */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: activeStep.color }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* ── HEADER ── */}
          <div className="text-center mb-16">
            <span className="text-[12px] tracking-tight block mb-4" style={{ ...mono, color: COLORS.slate }}>
              {"// "}
              {t("tuition.header.tag")}
            </span>
            <h2
              className="text-4xl sm:text-5xl font-semibold leading-tight tracking-[-0.02em] mb-4"
              style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            >
              {t("tuition.header.title")}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: COLORS.slate }}>
              {t("tuition.header.subtitle")}
            </p>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
            {/* level tabs, as difficulty meters */}
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1">
              {STEPS.map((step) => {
                const isActive = step.id === active;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActive(step.id)}
                    style={{
                      background: isActive ? `${step.color}12` : "rgba(18,20,28,0.02)",
                      borderColor: isActive ? step.color : "rgba(18,20,28,0.08)",
                    }}
                    className="relative flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border min-w-max transition-all duration-300"
                  >
                    <span
                      className="text-xs font-medium tracking-wide"
                      style={{ ...mono, color: isActive ? step.color : COLORS.slate }}
                    >
                      {t(`tuition.steps.${step.id}.label`)}
                    </span>
                    <DotMeter count={step.dots} color={step.color} />
                  </button>
                );
              })}
            </div>

            {/* preview card — a PR-review thread, not a generic chat */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: "#FFFFFF", border: "1px solid rgba(18,20,28,0.08)" }}
              >
                {/* comment thread */}
                <div className="mb-8 space-y-3">
                  <div className="max-w-sm rounded-xl px-4 py-3" style={{ background: "rgba(18,20,28,0.04)" }}>
                    <span className="text-[10px] tracking-widest uppercase block mb-1" style={{ ...mono, color: COLORS.slate }}>
                      student
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>
                      {t(`tuition.steps.${active}.leftBubble`)}
                    </p>
                  </div>

                  <div
                    className="max-w-sm rounded-xl px-4 py-3 ml-auto"
                    style={{ background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.3)" }}
                  >
                    <span className="text-[10px] tracking-widest uppercase block mb-1" style={{ ...mono, color: "#0D9488" }}>
                      ai_tutor
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>
                      {t(`tuition.steps.${active}.rightBubble`)}
                    </p>
                  </div>
                </div>

                {/* method cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {CARDS.map((card) => (
                    <div
                      key={card.key}
                      style={{ background: `${card.accent}0F`, border: `1px solid ${card.accent}22` }}
                      className="rounded-xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                    >
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${card.accent}18`, color: card.accent }}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: COLORS.ink }}>{t(`tuition.cards.${card.key}.title`)}</p>
                        <p className="text-xs mt-0.5" style={{ color: COLORS.slate }}>
                          {t(`tuition.cards.${card.key}.desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setOpenModal(true)}
                    className="font-medium px-10 py-3.5 rounded-full text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:opacity-90"
                    style={{ background: activeStep.color, color: COLORS.ink }}
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
            style={{ background: "rgba(18,20,28,0.75)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: COLORS.ink, border: "1px solid rgba(255,255,255,0.1)" }}
              className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center text-white/50 hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>

              <div className="p-8 pb-6 text-center">
                <span
                  className="text-xs font-medium tracking-widest uppercase mb-2 block"
                  style={{ ...mono, color: activeStep.color }}
                >
                  {t(`tuition.steps.${active}.label`)}
                </span>
                <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t(`tuition.steps.${active}.title`)}
                </h3>
                <p className="text-sm" style={{ color: COLORS.slate }}>
                  Structured lessons based on real conversations. PDFs, videos &amp; notes included.
                </p>
              </div>

              <div className="h-px mx-8" style={{ background: "rgba(255,255,255,0.07)" }} />

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through" style={{ color: COLORS.slate }}>
                      $49
                    </p>
                    {/* diff-style price, echoing the +87% badge on the hero */}
                    <p className="text-2xl font-semibold" style={mono}>
                      <span style={{ color: COLORS.mint }}>+</span>{" "}
                      <span style={{ color: COLORS.paper }}>50% OFF</span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/tuition/learning")}
                    className="font-medium px-7 py-3 rounded-xl text-sm hover:opacity-90 hover:scale-105 transition-all duration-200"
                    style={{ background: activeStep.color, color: COLORS.ink }}
                  >
                    {t("tuition.continue")}
                  </button>
                </div>

                <p className="text-center text-xs" style={{ color: COLORS.slate }}>
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