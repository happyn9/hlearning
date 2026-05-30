import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

/* ================= PROGRAMS ================= */
const programs = [
  {
    id: "software",
    titleKey: "technologies.programs.software.title",
    descKey: "technologies.programs.software.desc",
    icons: ["code-slash-outline", "layers-outline"],
  },
  {
    id: "cs",
    titleKey: "technologies.programs.cs.title",
    descKey: "technologies.programs.cs.desc",
    icons: ["git-branch-outline", "calculator-outline"],
  },
  {
    id: "network",
    titleKey: "technologies.programs.network.title",
    descKey: "technologies.programs.network.desc",
    icons: ["wifi-outline", "shield-checkmark-outline"],
  },
  {
    id: "finance",
    titleKey: "technologies.programs.finance.title",
    descKey: "technologies.programs.finance.desc",
    icons: ["cash-outline", "trending-up-outline"],
  },
  {
    id: "accounting",
    titleKey: "technologies.programs.accounting.title",
    descKey: "technologies.programs.accounting.desc",
    icons: ["document-text-outline", "calculator-outline"],
  },
  {
    id: "it",
    titleKey: "technologies.programs.it.title",
    descKey: "technologies.programs.it.desc",
    icons: ["server-outline", "hardware-chip-outline"],
  },
];

/* ================= CURRICULUM ================= */
const curriculum = {
  software: {
    "Level 1": ["ICT Fundamentals", "Intro to Programming", "Digital Logic"],
    "Level 2": ["Data Structures", "OOP", "Databases", "Web Development"],
    "Level 3": ["Application Development", "Mobile Development"],
    "Level 4": ["Final Year Project"],
  },
  cs: {
    "Level 1": ["Discrete Mathematics", "Programming I"],
    "Level 2": ["Algorithms", "Operating Systems"],
    "Level 3": ["Artificial Intelligence", "Compiler Design"],
    "Level 4": ["Capstone Project"],
  },
  network: {
    "Level 1": ["Networking Basics", "Data Communication"],
    "Level 2": ["Routing & Switching"],
    "Level 3": ["Network Security"],
    "Level 4": ["Enterprise Networks"],
  },
  finance: {
    "Level 1": ["Microeconomics", "Financial Principles"],
    "Level 2": ["Macroeconomics"],
    "Level 3": ["Investment Analysis"],
    "Level 4": ["Finance Project"],
  },
  accounting: {
    "Level 1": ["Financial Accounting"],
    "Level 2": ["Cost Accounting"],
    "Level 3": ["Auditing"],
    "Level 4": ["Accounting Project"],
  },
  it: {
    "Level 1": ["IT Fundamentals"],
    "Level 2": ["Systems Administration"],
    "Level 3": ["Cloud Computing"],
    "Level 4": ["Infrastructure Project"],
  },
};

export default function Technologies() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const navigate = useNavigate();

  const visiblePrograms = showAll ? programs : programs.slice(0, 3);

  return (
    <section className="py-20 bg-[#F6F9FC] relative">

      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-neutral-600 z-99"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.02 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-14 items-center mb-16">
          <div>
            <h2 className="text-4xl font-semibold text-neutral-700 leading-tight">
              {t("technology.header.title")}
            </h2>

            <p className="mt-4 text-neutral-600 max-w-md">
              {t("technology.header.subtitle")}
            </p>

            <button
              onClick={() => trigger(() => navigate("/workspace"))}
              className="mt-8 px-8 py-2.5 rounded-xl bg-slate-700 cursor-pointer text-white text-lg font-medium hover:bg-slate-800 duration-100 transition-shadow shadow-md hover:shadow-xl"
            >
              {t("technology.header.cta")}
            </button>
          </div>

          {/* PROGRAM CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visiblePrograms.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => trigger(() => setSelectedProgram(p))}
                  className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition group"
                >
                  <div className="flex gap-3 mb-4">
                    {p.icons.map((icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-500 group-hover:text-white transition"
                      >
                        <ion-icon name={icon} className="text-xl" />
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-slate-700 mb-2">
                    {t(p.titleKey)}
                  </h4>

                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {t(p.descKey)}
                  </p>

                  <div className="flex items-center text-sm font-medium text-neutral-600">
                    {t("technology.viewCurriculum")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SHOW MORE */}
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 rounded-lg bg-neutral-800 text-white hover:bg-neutral-900 transition"
          >
            {showAll
              ? t("technology.showLess")
              : t("technology.showMore", {
                  count: programs.length - 3,
                })}
          </button>
        </div>
      </div>
    </section>
  );
}