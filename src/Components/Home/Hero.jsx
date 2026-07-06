import React from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";


import {
  GraduationCap,
  MessageSquare,
  Flame,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";


const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const COLORS = {
  ink: "#12141C",
  paper: "#FAF9F5",
  mint: "#5EEAD4",
  pink: "#F472B6",
  amber: "#FBBF24",
  slate: "#7C8394",
};


const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.16, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};


function CodeWindow({ t }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden border border-black/10 shadow-[0_20px_60px_-15px_rgba(18,20,28,0.35)]"
      style={{ background: COLORS.ink }}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]" />
        <div className="flex items-center gap-4 ml-4">
          <span
            className="text-[11px] text-white/40 border-b-2 pb-[10px] -mb-[13px]"
            style={{ ...mono, borderColor: "transparent" }}
          >
            lesson_04.py
          </span>
          <span
            className="text-[11px] flex items-center gap-1.5 pb-[10px] -mb-[13px] border-b-2"
            style={{ ...mono, color: COLORS.mint, borderColor: COLORS.mint }}
          >
            <MessageSquare size={10} /> {t("hero.dashboard.aiFeedbackHint") ? "ai_tutor" : "ai_tutor"}
          </span>
        </div>
      </div>

      {/* code body */}
      <div className="px-5 py-5 text-[13px] leading-relaxed" style={mono}>
        <div className="flex gap-4">
          <div className="text-white/25 select-none text-right w-4 shrink-0">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
          <div className="text-white/85 space-y-0">
            <div>
              <span style={{ color: COLORS.pink }}>def</span>{" "}
              <span style={{ color: COLORS.mint }}>reverse_word</span>
              (word):
            </div>
            <div className="pl-4">
              <span style={{ color: COLORS.pink }}>return</span> word[::
              <span style={{ color: COLORS.amber }}>-1</span>]
            </div>
            <div className="pl-4 text-white/25">
              # try reverse_word(&quot;code&quot;)
            </div>
            <div>
              <span style={{ color: COLORS.slate }}>print(</span>
              reverse_word(<span style={{ color: COLORS.amber }}>&quot;code&quot;</span>)
              <span style={{ color: COLORS.slate }}>)</span>
            </div>
          </div>
        </div>

        {/* inline AI review comment */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-4 ml-8 rounded-lg border px-3 py-2.5 flex gap-2"
          style={{ background: "rgba(94,234,212,0.08)", borderColor: "rgba(94,234,212,0.25)" }}
        >
          <span style={{ color: COLORS.mint }} className="text-[12px] shrink-0">
            ◆
          </span>
          <p className="text-[12px] text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("hero.dashboard.aiFeedbackHint")}
          </p>
        </motion.div>
      </div>

      {/* status bar — reuses lesson progress as a build/test readout */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40" style={mono}>
            {t("hero.dashboard.module")} 4/7
          </span>
          <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: COLORS.mint }}
              initial={{ width: 0 }}
              animate={{ width: "57%" }}
              transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ ...mono, color: COLORS.amber }}>
          <Flame size={11} /> 14d
        </span>
      </div>
    </motion.div>
  );
}

/* ─── main component ─── */
function Hero({ onGetStarted, onWatch, onFeedback, onModalUser }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const connected = Boolean(user);

  const goAuth = () => trigger(() => navigate("/auth"));

  return (
    <div className="relative min-h-screen" style={{ background: COLORS.paper }}>
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-[2px] z-50"
          style={{ background: COLORS.mint }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      )}

      <Navbar onModal={onModalUser} OnNav={goAuth} />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-14 items-start">
          {/* ── LEFT ── */}
          <div className="flex-1 flex flex-col">
            {/* eyebrow, written like a code comment */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-7">
              <span
                className="text-[12px] tracking-tight"
                style={{ ...mono, color: COLORS.slate }}
              >
                {"// "}
                {t("hero.aiExperience")}
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-5xl sm:text-6xl font-semibold leading-[1.08] tracking-[-0.03em] mb-6"
              style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            >
              {connected ? (
                <>
                  {t("hero.welcomeBack")}{" "}
                  <span style={{ ...mono, color: COLORS.pink }}>{user?.name}</span>
                </>
              ) : (
                <>
                  {t("hero.title1")}
                  <br />
                  <span style={mono}>
                    <span style={{ color: COLORS.mint }}>{"{"}</span>
                    <span style={{ color: COLORS.ink }}> {t("hero.title2")} </span>
                    <span style={{ color: COLORS.mint }}>{"}"}</span>
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-[15px] leading-relaxed max-w-md mb-10"
              style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex items-center gap-3 mb-12 flex-wrap"
            >
              <button
                onClick={onGetStarted}
                className="flex cursor-pointer items-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition hover:opacity-90"
                style={{ background: COLORS.ink, color: COLORS.paper }}
              >
                {user ? t("hero.ready") : t("hero.getStarted")}
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onWatch}
                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-transparent text-sm font-medium rounded-full border transition hover:bg-black/[0.03]"
                style={{ borderColor: "rgba(18,20,28,0.15)", color: COLORS.ink }}
              >
                <PlayCircle size={16} />
                {t("hero.watchDemo")}
              </button>
            </motion.div>

            {/* social proof, styled like a contributor stat */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex items-center gap-3 mb-14"
            >
              <div className="flex -space-x-2">
                {["AL", "MR", "JK", "SC"].map((init, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-medium"
                    style={{ borderColor: COLORS.paper, background: "rgba(18,20,28,0.08)", color: COLORS.ink }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-[13px]" style={{ color: COLORS.slate }}>
                <span style={{ ...mono, color: COLORS.ink }}>+12,000</span>{" "}
                {t("hero.activeUsers")}
              </p>
            </motion.div>

            {/* feature list */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="flex flex-col gap-2.5">
              {[
                { icon: GraduationCap, label: t("hero.smartCourses") },
                { icon: MessageSquare, label: t("hero.aiTutor") },
                { icon: Flame, label: t("hero.dailyStreak") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-[13px]" style={{ color: COLORS.slate }}>
                  <CheckCircle2 size={14} style={{ color: COLORS.mint }} className="shrink-0" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: signature IDE window ── */}
          <div className="w-full lg:w-[440px] lg:sticky lg:top-24 relative">
            <CodeWindow t={t} />

            {/* diff-style badge, echoing a git-diff insertion line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.35, ease: "backOut" }}
              className="absolute -bottom-4 -right-3 flex items-center gap-1 rounded-lg px-2.5 py-1.5 shadow-md border"
              style={{ background: COLORS.ink, borderColor: "rgba(94,234,212,0.3)" }}
            >
              <span className="text-[11px]" style={{ ...mono, color: COLORS.mint }}>
                + 87%
              </span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;