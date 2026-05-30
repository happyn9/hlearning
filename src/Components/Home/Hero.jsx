import React from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";

/* ICONS */
import {
  Sparkles,
  GraduationCap,
  MessageSquare,
  Flame,
  ArrowRight,
  PlayCircle,
  TrendingUp,
  BadgeQuestionMark
} from "lucide-react";

/* IMAGE */
import student from "/src/assets/logo.png";

function Hero({ onGetStarted, onWatch, onFeedback, onModalUser }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const connected = Boolean(user);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  const goAuth = () => trigger(() => navigate("/auth"));
  return (
    <div className="relative bg-white">
      {/* PROGRESS */}
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-neutral-600 z-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      )}

      <Navbar onModal={onModalUser} OnNav={goAuth} />

      <section className="relative">

        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50 to-white" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">

          {/* BADGE */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm mb-6"
          >
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-gray-600">
              {t("hero.aiExperience")}
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6"
          >
            {connected ? (
              <>
                {t("hero.welcomeBack")}{" "}
                <span className="text-indigo-600">
                  {user?.name}
                </span>
              </>
            ) : (
              <>
                {t("hero.title1")} <br />
                {t("hero.title2")}
              </>
            )}
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="text-gray-500 text-lg max-w-2xl mx-auto mb-10"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex justify-center gap-4 mb-16 flex-wrap"
          >
            <button
              onClick={onGetStarted}
              className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition"
            >
              {user ? t("hero.ready") : t("hero.getStarted")}

              {user ? (
                <BadgeQuestionMark size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>

            <button
              onClick={onWatch}
              className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <PlayCircle size={18} />
              {t("hero.watchDemo")}
            </button>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <img
              src={student}
              alt="student learning online"
              className="w-70 sm:w-90 lg:w-125 object-contain"
            />

            {/* FLOATING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={onFeedback}
              className="absolute cursor-pointer top-0 left-0 bg-white shadow-md px-4 py-2 rounded-xl text-sm flex items-center gap-2"
            >
              <MessageSquare size={14} />
              {t("hero.aiFeedback")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-0 right-0 bg-white shadow-md px-4 py-2 rounded-xl text-sm flex items-center gap-2"
            >
              <TrendingUp size={14} />
              {t("hero.progress")}
            </motion.div>

          </motion.div>

          {/* FEATURES */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-20 grid grid-cols-2 sm:grid-cols-3 gap-6 text-gray-600 text-sm max-w-xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap size={16} />
              {t("hero.smartCourses")}
            </div>

            <div className="flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              {t("hero.aiTutor")}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Flame size={16} />
              {t("hero.dailyStreak")}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default Hero;