import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  Search,
  BookOpen,
  Code2,
  BarChart3,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Briefcase,
  ListChecks,
  PartyPopper,
  MoreHorizontal,
  Cpu,
  Network,
  Calculator,
  Languages,
  PenTool,
  FlaskConical,
  PenLine,
  ShieldCheck,
  Check,
  Database,
  Settings2,
  UserCheck,
  FileText,
  Lock,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Same token system as Hero.jsx / Tuition.jsx — keep in sync.
   Load once globally:
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
───────────────────────────────────────────────────────── */
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const COLORS = {
  ink: "#0C0D12",
  panel: "#12141C",
  mint: "#5EEAD4",
  pink: "#F472B6",
  amber: "#FBBF24",
  slate: "#7C8394",
};

const stepOneIcons = {
  Search: Search,
  "Learn & study": BookOpen,
  "Code or debug": Code2,
  "Analyze data": BarChart3,
  "Create something": Sparkles,
  Brainstorm: Lightbulb,
};

const stepTwoIcons = {
  School: GraduationCap,
  Work: Briefcase,
  "Personal tasks": ListChecks,
  "Fun and entertainment": PartyPopper,
  Other: MoreHorizontal,
};

const stepProgramIcons = {
  se: Code2,
  cs: Cpu,
  net: Network,
  af: Calculator,
  eng: Languages,
};

const stepThreeIcons = {
  math: Calculator,
  programming: Code2,
  design: PenTool,
  business: Briefcase,
  science: FlaskConical,
  writing: PenLine,
};

const stepData = {
  StepOne: {
    titleKey: "onboarding.stepOne.title",
    options: ["Search", "Learn & study", "Code or debug", "Analyze data", "Create something", "Brainstorm"],
    key: "goals",
    icons: stepOneIcons,
  },
  StepTwo: {
    titleKey: "onboarding.stepTwo.title",
    options: ["School", "Work", "Personal tasks", "Fun and entertainment", "Other"],
    key: "reason",
    icons: stepTwoIcons,
  },
  StepProgram: {
    titleKey: "onboarding.stepProgram.title",
    options: [
      { id: "se", labelKey: "onboarding.programs.software" },
      { id: "cs", labelKey: "onboarding.programs.cs" },
      { id: "net", labelKey: "onboarding.programs.network" },
      { id: "af", labelKey: "onboarding.programs.accounting" },
      { id: "eng", labelKey: "onboarding.programs.languages" },
    ],
    key: "program",
    icons: stepProgramIcons,
  },
  StepThree: {
    titleKey: "onboarding.stepThree.title",
    options: ["math", "programming", "design", "business", "science", "writing"],
    key: "likes",
    icons: stepThreeIcons,
  },
  StepPrivacy: {
    titleKey: "onboarding.stepPrivacy.title",
    key: "acceptedPolicies",
  },
};

/* ─── signature element: a live config file that fills in as the
   person answers — the onboarding literally is the product's
   config being written, so the panel shows exactly that. ─── */
function ProfileConfig({ user, activeKey }) {
  const g = user.onboarding || {};
  const a = user.academic || {};

  const rows = [
    { key: "goals", value: Array.isArray(g.goals) && g.goals.length ? g.goals.join(", ") : null },
    { key: "reason", value: g.reason || null },
    { key: "program", value: a.program || null },
    { key: "likes", value: Array.isArray(g.likes) && g.likes.length ? g.likes.join(", ") : null },
    { key: "accepted", value: g.acceptedPolicies ? "true" : null },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
      style={{ background: COLORS.panel }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]" />
        <span className="text-[11px] text-white/40 ml-3" style={mono}>
          profile.yaml
        </span>
      </div>

      <div className="px-5 py-5 text-[13px] leading-loose" style={mono}>
        <div className="text-white/85">
          <span style={{ color: COLORS.pink }}>learner</span>:
        </div>
        {rows.map(({ key, value }) => {
          const isActive = key === activeKey;
          return (
            <div key={key} className="pl-4 flex items-start gap-2">
              <span className="text-white/25 select-none">{value ? "▸" : "·"}</span>
              <span>
                <span style={{ color: isActive ? COLORS.mint : COLORS.slate }}>{key}</span>
                <span className="text-white/25">: </span>
                <AnimatePresence mode="wait">
                  {value ? (
                    <motion.span
                      key={value}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ color: COLORS.mint }}
                    >
                      {value}
                    </motion.span>
                  ) : (
                    <span className="text-white/20">null</span>
                  )}
                </AnimatePresence>
              </span>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-white/10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.mint }} />
        <span className="text-[11px] text-white/40" style={mono}>
          writing config…
        </span>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { t } = useTranslation();

  const [step, setStep] = useState(0);

  const steps = Object.keys(stepData);
  const currentStep = steps[step];
  const data = stepData[currentStep];

  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (user && (!user.onboarding || !user.academic)) {
      setUser({
        ...user,
        onboarding: user.onboarding ?? {},
        academic: user.academic ?? {},
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate("/mydashboard");
    }
  }, []);

  if (!user) return null;

  const selected =
    currentStep === "StepProgram"
      ? user.academic?.program ?? ""
      : currentStep === "StepPrivacy"
      ? !!user.onboarding?.acceptedPolicies
      : user.onboarding?.[data.key] ?? [];

  const toggleOption = (opt) => {
    if (currentStep === "StepProgram") {
      setUser({ ...user, academic: { ...user.academic, program: opt.id } });
      setStep(step + 1);
    } else if (currentStep === "StepPrivacy") {
      setUser({
        ...user,
        onboarding: { ...user.onboarding, acceptedPolicies: !selected },
      });
    } else if (Array.isArray(selected)) {
      const updated = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
      setUser({ ...user, onboarding: { ...user.onboarding, [data.key]: updated } });
    } else {
      setUser({ ...user, onboarding: { ...user.onboarding, [data.key]: opt } });
      setStep(step + 1);
    }
  };

  const finishOnboarding = async () => {
    if (
      !user.onboarding.reason ||
      !user.academic.program ||
      !user.onboarding.likes?.length ||
      !user.onboarding.acceptedPolicies
    ) {
      alert(t("onboarding.completeAll"));
      return;
    }

    const payload = {
      reason: user.onboarding.reason || "",
      program: typeof user.academic.program === "string" ? user.academic.program : user.academic.program?.id || "",
      likes: Array.isArray(user.onboarding.likes) ? user.onboarding.likes : [],
    };

    await api.post("/recommendations/home", payload);
    navigate("/", { replace: true });
  };

  const activeConfigKey =
    currentStep === "StepPrivacy" ? "accepted" : currentStep === "StepProgram" ? "program" : data.key;

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden"
      style={{ background: `radial-gradient(circle at 15% 10%, ${COLORS.mint}14, transparent 45%), radial-gradient(circle at 85% 90%, ${COLORS.pink}12, transparent 45%), ${COLORS.ink}` }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 sm:gap-8 relative z-10">
        {/* LEFT — the flow itself */}
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-6 sm:space-y-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
        >
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: COLORS.mint, boxShadow: `0 0 12px ${COLORS.mint}99` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-[11px] text-white/40 tabular-nums shrink-0" style={mono}>
              {step + 1}/{steps.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 sm:space-y-8"
            >
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t(data.titleKey)}
              </h1>

              {currentStep === "StepPrivacy" ? (
                <>
                  <div className="flex items-center gap-3 -mt-2">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${COLORS.mint}18`, border: `1px solid ${COLORS.mint}4D` }}
                    >
                      <Lock className="w-5 h-5" style={{ color: COLORS.mint }} />
                    </div>
                    <p className="text-sm text-white/50 leading-snug">
                      {t("onboarding.privacy.subtitle", {
                        defaultValue: "Quick rundown before you get your first recommendations.",
                      })}
                    </p>
                  </div>

                  <div className="max-h-[38vh] sm:h-72 overflow-y-auto pr-2 -mr-2 space-y-3 scrollbar-thin">
                    {[
                      { icon: Database, titleKey: "onboarding.privacy.collect.title", descKey: "onboarding.privacy.collect.desc" },
                      { icon: Settings2, titleKey: "onboarding.privacy.use.title", descKey: "onboarding.privacy.use.desc" },
                      { icon: UserCheck, titleKey: "onboarding.privacy.rights.title", descKey: "onboarding.privacy.rights.desc" },
                      { icon: FileText, titleKey: "onboarding.privacy.terms.title", descKey: "onboarding.privacy.terms.desc" },
                    ].map(({ icon: SectionIcon, titleKey, descKey }) => (
                      <div
                        key={titleKey}
                        className="p-4 rounded-xl transition-colors"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <h3 className="text-white font-semibold text-sm mb-1.5 flex items-center gap-2">
                          <SectionIcon className="w-4 h-4 shrink-0" style={{ color: COLORS.mint }} />
                          {t(titleKey)}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm pl-6">{t(descKey)}</p>
                      </div>
                    ))}
                  </div>

                  <label className="flex gap-3 items-start cursor-pointer select-none group p-3 rounded-xl -mx-3 hover:bg-white/[0.03] transition-colors">
                    <span
                      className="w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: selected ? COLORS.mint : "transparent",
                        borderColor: selected ? COLORS.mint : "rgba(255,255,255,0.2)",
                      }}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                    </span>
                    <input type="checkbox" checked={selected} onChange={toggleOption} className="sr-only" />
                    <span className="text-white/80 text-sm leading-relaxed">
                      {t("onboarding.accept")}{" "}
                      <span style={{ color: COLORS.mint }} className="font-semibold">
                        {t("onboarding.privacyPolicy")}
                      </span>{" "}
                      {t("onboarding.and")}{" "}
                      <span style={{ color: COLORS.mint }} className="font-semibold">
                        {t("onboarding.terms")}
                      </span>
                    </span>
                  </label>

                  <button
                    onClick={finishOnboarding}
                    disabled={!selected}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: COLORS.mint,
                      color: COLORS.ink,
                      boxShadow: selected ? `0 0 25px ${COLORS.mint}66` : "none",
                    }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {t("onboarding.finish")}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {data.options.map((opt) => {
                      const label = typeof opt === "string" ? t(`onboarding.options.${opt}`) : t(opt.labelKey);
                      const value = typeof opt === "string" ? opt : opt.id;
                      const active = Array.isArray(selected) ? selected.includes(value) : selected === value;
                      const Icon = data.icons?.[value];

                      return (
                        <button
                          key={label}
                          onClick={() => toggleOption(typeof opt === "string" ? opt : opt)}
                          className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border flex items-center gap-2 text-sm transition-all duration-200"
                          style={
                            active
                              ? { background: COLORS.mint, color: COLORS.ink, borderColor: COLORS.mint, boxShadow: `0 0 18px ${COLORS.mint}66`, transform: "scale(1.03)" }
                              : { borderColor: "rgba(255,255,255,0.15)", color: "white" }
                          }
                        >
                          {Icon && <Icon className="w-4 h-4" style={{ color: active ? COLORS.ink : COLORS.mint }} />}
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={Array.isArray(selected) && selected.length === 0}
                      className="px-7 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40"
                      style={{ background: COLORS.mint, color: COLORS.ink }}
                    >
                      {t("onboarding.continue")} →
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — signature live-config panel, desktop only */}
        <div className="hidden lg:block sticky top-24 self-start">
          <ProfileConfig user={user} activeKey={activeConfigKey} />
        </div>
      </div>
    </div>
  );
}