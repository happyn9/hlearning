import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

/* Same token system as Hero.jsx — keep in sync. */
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const COLORS = {
  ink: "#12141C",
  paper: "#FAF9F5",
  white: "#FFFFFF",
  mint: "#5EEAD4",
  mintDeep: "#0D9488",
  pink: "#F472B6",
  amber: "#FBBF24",
  rose: "#F87171",
  slate: "#7C8394",
  line: "rgba(18,20,28,0.08)",
};

const STEPS = [
  { id: "Beginner", dots: 1, color: COLORS.mint, glow: "rgba(94,234,212,0.35)" },
  { id: "Intermediate", dots: 2, color: COLORS.pink, glow: "rgba(244,114,182,0.35)" },
  { id: "Advanced", dots: 3, color: COLORS.amber, glow: "rgba(251,191,36,0.35)" },
];

const CARDS = [
  {
    key: "pdf",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.pink,
  },
  {
    key: "video",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.amber,
  },
  {
    key: "notes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: COLORS.mintDeep,
  },
];

function DotMeter({ count, color, muted }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full transition-colors duration-300"
          style={{ background: i < count ? color : muted }}
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
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: COLORS.paper }}>
        {/* soft ambient mesh — quiet, follows the active accent */}
        <motion.div
          animate={{ background: activeStep.glow }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[560px] h-[320px] sm:h-[560px] rounded-full blur-[90px] sm:blur-[110px] opacity-60"
        />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          {/* ── HEADER ── */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-[12px] tracking-tight block mb-3 sm:mb-4" style={{ ...mono, color: COLORS.slate }}>
              {"// "}
              {t("tuition.header.tag")}
            </span>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] sm:leading-[1.05] tracking-[-0.02em] sm:tracking-[-0.03em] mb-3 sm:mb-4"
              style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            >
              {t("tuition.header.title")}
            </h2>
            <p className="text-base sm:text-lg max-w-md mx-auto" style={{ color: COLORS.slate }}>
              {t("tuition.header.subtitle")}
            </p>
          </div>

          {/* ── SEGMENTED CONTROL, animated sliding pill ── */}
          <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto mb-8 sm:mb-10 scrollbar-none">
            <div
              className="relative flex mx-auto p-1 rounded-full w-fit min-w-full sm:min-w-0 justify-center sm:justify-start"
              style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, boxShadow: "0 1px 2px rgba(18,20,28,0.04)" }}
            >
              {STEPS.map((step) => {
                const isActive = step.id === active;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActive(step.id)}
                    className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-colors duration-200"
                    style={{ ...mono, color: isActive ? COLORS.ink : COLORS.slate }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tuition-pill"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ background: COLORS.paper, border: `1px solid ${step.color}` }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    {t(`tuition.steps.${step.id}.label`)}
                    <DotMeter count={step.dots} color={step.color} muted="rgba(18,20,28,0.12)" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── PREVIEW ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* diff card — the signature: progress expressed as a code diff */}
              <div
                className="rounded-[20px] overflow-hidden mb-6"
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.line}`,
                  boxShadow: `0 20px 50px -20px ${activeStep.glow}, 0 2px 6px rgba(18,20,28,0.04)`,
                }}
              >
                <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: COLORS.line }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS.rose, opacity: 0.4 }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS.amber, opacity: 0.4 }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: activeStep.color }} />
                  <span className="text-[11px] ml-2" style={{ ...mono, color: COLORS.slate }}>
                    {active.toLowerCase()}.diff
                  </span>
                </div>

                <div className="text-[14px] leading-relaxed">
                  <div className="flex gap-3 px-5 py-4" style={{ background: "rgba(248,113,113,0.06)" }}>
                    <span style={{ ...mono, color: COLORS.rose }} className="select-none shrink-0 font-medium">
                      −
                    </span>
                    <span style={{ color: COLORS.ink }}>{t(`tuition.steps.${active}.leftBubble`)}</span>
                  </div>
                  <div className="flex gap-3 px-5 py-4" style={{ background: `${activeStep.color}14` }}>
                    <span style={{ ...mono, color: COLORS.mintDeep }} className="select-none shrink-0 font-medium">
                      +
                    </span>
                    <span style={{ color: COLORS.ink }}>{t(`tuition.steps.${active}.rightBubble`)}</span>
                  </div>
                </div>
              </div>

              {/* method cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-9">
                {CARDS.map((card) => (
                  <motion.div
                    key={card.key}
                    whileHover={{ y: -3 }}
                    className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer"
                    style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, boxShadow: "0 1px 3px rgba(18,20,28,0.04)" }}
                  >
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: `${card.accent}14`, color: card.accent }}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: COLORS.ink }}>
                        {t(`tuition.cards.${card.key}.title`)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: COLORS.slate }}>
                        {t(`tuition.cards.${card.key}.desc`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenModal(true)}
                  className="font-medium px-10 py-4 rounded-full text-sm tracking-wide"
                  style={{ background: COLORS.ink, color: COLORS.paper, boxShadow: `0 12px 30px -10px ${activeStep.glow}` }}
                >
                  {t("tuition.cta")}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
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
            style={{ background: "rgba(18,20,28,0.45)", backdropFilter: "blur(10px)" }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: COLORS.white, border: `1px solid ${COLORS.line}` }}
              className="relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center transition hover:bg-black/[0.04]"
                style={{ background: "rgba(18,20,28,0.05)", color: COLORS.slate }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>

              <div className="p-8 pb-6 text-center">
                <span
                  className="text-xs font-medium tracking-widest uppercase mb-2 block"
                  style={{ ...mono, color: activeStep.color === COLORS.mint ? COLORS.mintDeep : activeStep.color }}
                >
                  {t(`tuition.steps.${active}.label`)}
                </span>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                  {t(`tuition.steps.${active}.title`)}
                </h3>
                <p className="text-sm" style={{ color: COLORS.slate }}>
                  Structured lessons based on real conversations. PDFs, videos &amp; notes included.
                </p>
              </div>

              <div className="h-px mx-8" style={{ background: COLORS.line }} />

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through" style={{ color: COLORS.slate }}>
                      $49
                    </p>
                    <p className="text-2xl font-semibold" style={mono}>
                      <span style={{ color: COLORS.mintDeep }}>+</span>{" "}
                      <span style={{ color: COLORS.ink }}>50% OFF</span>
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/tuition/learning")}
                    className="font-medium px-7 py-3 rounded-xl text-sm"
                    style={{ background: COLORS.ink, color: COLORS.paper }}
                  >
                    {t("tuition.continue")}
                  </motion.button>
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