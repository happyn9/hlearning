import React from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";

import {
  Sparkles,
  GraduationCap,
  MessageSquare,
  Flame,
  ArrowRight,
  PlayCircle,
  TrendingUp,
  BadgeQuestionMark,
  CheckCircle2,
  Zap,
} from "lucide-react";

import student from "/src/assets/logo.png";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── small reusable pill ─── */
function Pill({ icon: Icon, label, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-stone-200 bg-white text-stone-500 ${className}`}
    >
      {Icon && <Icon size={12} />}
      {label}
    </span>
  );
}

/* ─── dashboard card (right side) ─── */
function DashCard({ t }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-5 h-full"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-widest uppercase text-stone-400">
          {t("hero.dashboard.inProgress")}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* course title */}
      <div>
        <p className="text-[11px] text-stone-400 mb-1">{t("hero.dashboard.module")} 4 / 7</p>
        <h3 className="text-lg font-semibold text-stone-900 leading-snug tracking-tight">
          {t("hero.dashboard.courseTitle")}
        </h3>
      </div>

      {/* progress */}
      <div>
        <div className="flex justify-between text-[11px] text-stone-400 mb-2">
          <span>{t("hero.dashboard.progress")}</span>
          <span className="text-stone-800 font-medium">57 %</span>
        </div>
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "57%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* divider */}
      <div className="border-t border-stone-100" />

      {/* stat row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame size={13} className="text-orange-400" />
            <span className="text-[11px] text-stone-400">{t("hero.dashboard.streak")}</span>
          </div>
          <p className="text-xl font-semibold text-stone-900 tracking-tight">14</p>
          <p className="text-[10px] text-stone-400">{t("hero.dashboard.days")}</p>
        </div>
        <div className="bg-stone-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={13} className="text-violet-400" />
            <span className="text-[11px] text-stone-400">{t("hero.dashboard.aiReply")}</span>
          </div>
          <p className="text-xl font-semibold text-stone-900 tracking-tight">3 s</p>
          <p className="text-[10px] text-stone-400">{t("hero.dashboard.average")}</p>
        </div>
      </div>

      {/* ai feedback chip */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex items-center gap-2 text-xs text-stone-500 border border-stone-200 rounded-xl px-3 py-2.5 bg-white hover:bg-stone-50 transition cursor-pointer text-left"
      >
        <MessageSquare size={13} className="text-violet-500 shrink-0" />
        <span>{t("hero.dashboard.aiFeedbackHint")}</span>
      </motion.button>
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
    <div className="relative bg-[#F7F6F2] min-h-screen">
      {/* progress bar */}
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-[2px] bg-violet-500 z-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      )}

      <Navbar onModal={onModalUser} OnNav={goAuth} />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 flex flex-col">

            {/* eyebrow */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="flex items-center gap-2 mb-8"
            >
              <span className="w-5 h-[1px] bg-stone-400" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400">
                {t("hero.aiExperience")}
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-5xl sm:text-6xl font-semibold leading-[1.08] tracking-[-0.03em] text-stone-900 mb-6"
            >
              {connected ? (
                <>
                  {t("hero.welcomeBack")}{" "}
                  <span className="text-violet-600 italic font-medium">
                    {user?.name}
                  </span>
                </>
              ) : (
                <>
                  {t("hero.title1")}
                  <br />
                  <span className="text-violet-600 italic font-medium">
                    {t("hero.title2")}
                  </span>
                </>
              )}
            </motion.h1>

            {/* subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-[15px] text-stone-500 leading-relaxed max-w-md mb-10"
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
                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition"
              >
                {user ? t("hero.ready") : t("hero.getStarted")}
                {user ? <BadgeQuestionMark size={16} /> : <ArrowRight size={16} />}
              </button>

              <button
                onClick={onWatch}
                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-transparent text-sm font-medium text-stone-600 border border-stone-200 rounded-full hover:bg-white transition"
              >
                <PlayCircle size={16} />
                {t("hero.watchDemo")}
              </button>
            </motion.div>

            {/* social proof */}
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
                    className="w-7 h-7 rounded-full border-2 border-[#F7F6F2] bg-stone-200 flex items-center justify-center text-[10px] font-medium text-stone-600"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-stone-400">
                <span className="text-stone-800 font-medium">+12 000</span>{" "}
                {t("hero.activeUsers")}
              </p>
            </motion.div>

            {/* feature list */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
              className="flex flex-col gap-2.5"
            >
              {[
                { icon: GraduationCap, label: t("hero.smartCourses") },
                { icon: MessageSquare, label: t("hero.aiTutor") },
                { icon: Flame, label: t("hero.dailyStreak") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-[13px] text-stone-500">
                  <CheckCircle2 size={14} className="text-violet-500 shrink-0" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="w-full lg:w-[420px] lg:sticky lg:top-24 relative">

            {/* ── Floating student image ── */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute -left-14 top-1/2 -translate-y-1/2 z-10"
            >
              {/* soft violet halo */}
              <div
                className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)",
                  transform: "scale(1.4)",
                }}
              />

              {/* avatar ring */}
              <div
                className="relative w-[88px] h-[88px] rounded-full overflow-hidden"
                style={{
                  boxShadow: "0 0 0 3px #fff, 0 0 0 5px #ede9fe, 0 12px 32px rgba(109,40,217,0.2)",
                }}
              >
                <img
                  src={student}
                  alt="student"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* +87% badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.35, ease: "backOut" }}
                className="absolute -bottom-2.5 -right-3 flex items-center gap-1 bg-white rounded-full pl-1.5 pr-2.5 py-1 shadow-md border border-stone-100"
              >
                <TrendingUp size={10} className="text-violet-500" />
                <span className="text-[10px] font-bold text-stone-800">+87%</span>
              </motion.div>
            </motion.div>

            <DashCard t={t} />
          </div>

        </div>
      </section>
    </div>
  );
}

export default Hero;