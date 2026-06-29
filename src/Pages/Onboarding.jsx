import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
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

// Icon lookup tables — one icon per option, keyed by the same
// string/id values already used in stepData. No logos, just glyphs
// that ride alongside each label.
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
    options: [
      "Search",
      "Learn & study",
      "Code or debug",
      "Analyze data",
      "Create something",
      "Brainstorm",
    ],
    key: "goals",
    icons: stepOneIcons,
    image:
      "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },

  StepTwo: {
    titleKey: "onboarding.stepTwo.title",
    options: [
      "School",
      "Work",
      "Personal tasks",
      "Fun and entertainment",
      "Other",
    ],
    key: "reason",
    icons: stepTwoIcons,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    image:
      "https://www.startertutorials.com/blog/wp-content/uploads/2016/04/Program-development-steps.png",
  },

  StepThree: {
    titleKey: "onboarding.stepThree.title",
    options: [
      "math",
      "programming",
      "design",
      "business",
      "science",
      "writing",
    ],
    key: "likes",
    icons: stepThreeIcons,
    image:
      "https://www.shutterstock.com/image-photo/yellow-green-note-paper-t-260nw-467071289.jpg",
  },

  StepPrivacy: {
    titleKey: "onboarding.stepPrivacy.title",
    key: "acceptedPolicies",
    image:
      "https://www.cookiebot.com/en/wp-content/uploads/sites/7/2024/11/cb_blog_hero_770x513_priv_by_design_112124.svg?v=af75507fe051a4f1",
  },
};

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
      setUser({
        ...user,
        academic: {
          ...user.academic,
          program: opt.id,
        },
      });

      setStep(step + 1);
    } else if (currentStep === "StepPrivacy") {
      setUser({
        ...user,
        onboarding: {
          ...user.onboarding,
          acceptedPolicies: !selected,
        },
      });
    } else if (Array.isArray(selected)) {
      const updated = selected.includes(opt)
        ? selected.filter((o) => o !== opt)
        : [...selected, opt];

      setUser({
        ...user,
        onboarding: {
          ...user.onboarding,
          [data.key]: updated,
        },
      });
    } else {
      setUser({
        ...user,
        onboarding: {
          ...user.onboarding,
          [data.key]: opt,
        },
      });

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
      program:
        typeof user.academic.program === "string"
          ? user.academic.program
          : user.academic.program?.id || "",
      likes: Array.isArray(user.onboarding.likes)
        ? user.onboarding.likes
        : [],
    };

    await api.post("/recommendations/home", payload);

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow accents — quiet background atmosphere, not decoration for its own sake */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* LEFT */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_60px_-15px_rgba(163,230,53,0.25)] space-y-8">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-500 to-lime-300 transition-all duration-500 shadow-[0_0_12px_rgba(163,230,53,0.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40 font-medium tabular-nums">
              {step + 1}/{steps.length}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {t(data.titleKey)}
          </h1>

          {currentStep === "StepPrivacy" ? (
            <>
              {/* Lock badge — the visual anchor for this step, replaces the right-side image */}
              <div className="flex items-center gap-3 -mt-2">
                <div className="w-11 h-11 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-lime-400" />
                </div>
                <p className="text-sm text-white/50 leading-snug">
                  {t("onboarding.privacy.subtitle", {
                    defaultValue:
                      "Quick rundown before you get your first recommendations.",
                  })}
                </p>
              </div>

              {/* Privacy sections */}
              <div className="h-80 overflow-y-auto pr-2 -mr-2 space-y-3 mt-4 scrollbar-thin scrollbar-thumb-lime-500/60 scrollbar-track-transparent">
                {[
                  {
                    icon: Database,
                    titleKey: "onboarding.privacy.collect.title",
                    descKey: "onboarding.privacy.collect.desc",
                  },
                  {
                    icon: Settings2,
                    titleKey: "onboarding.privacy.use.title",
                    descKey: "onboarding.privacy.use.desc",
                  },
                  {
                    icon: UserCheck,
                    titleKey: "onboarding.privacy.rights.title",
                    descKey: "onboarding.privacy.rights.desc",
                  },
                  {
                    icon: FileText,
                    titleKey: "onboarding.privacy.terms.title",
                    descKey: "onboarding.privacy.terms.desc",
                  },
                ].map(({ icon: SectionIcon, titleKey, descKey }) => (
                  <div
                    key={titleKey}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-lime-500/30 transition-colors"
                  >
                    <h3 className="text-white font-semibold text-sm mb-1.5 flex items-center gap-2">
                      <SectionIcon className="w-4 h-4 text-lime-400 shrink-0" />
                      {t(titleKey)}
                    </h3>

                    <p className="text-gray-400 leading-relaxed text-sm pl-6">
                      {t(descKey)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Checkbox */}
              <label className="flex gap-3 items-start mt-5 cursor-pointer select-none group p-3 rounded-xl hover:bg-white/[0.03] transition-colors -mx-3">
                <span
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    selected
                      ? "bg-lime-500 border-lime-500"
                      : "border-white/20 group-hover:border-lime-400"
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                </span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={toggleOption}
                  className="sr-only"
                />

                <span className="text-white/80 text-sm leading-relaxed">
                  {t("onboarding.accept")}{" "}
                  <span className="text-lime-400 font-semibold">
                    {t("onboarding.privacyPolicy")}
                  </span>{" "}
                  {t("onboarding.and")}{" "}
                  <span className="text-lime-400 font-semibold">
                    {t("onboarding.terms")}
                  </span>
                </span>
              </label>

              {/* Finish */}
              <button
                onClick={finishOnboarding}
                disabled={!selected}
                className="w-full py-4 mt-2 rounded-2xl bg-lime-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-lime-400 hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all duration-300 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-4 h-4" />
                {t("onboarding.finish")}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 mt-4">
                {data.options.map((opt) => {
                  const label =
                    typeof opt === "string"
                      ? t(`onboarding.options.${opt}`)
                      : t(opt.labelKey);

                  const value =
                    typeof opt === "string" ? opt : opt.id;

                  const active = Array.isArray(selected)
                    ? selected.includes(value)
                    : selected === value;

                  const Icon = data.icons?.[value];

                  return (
                    <button
                      key={label}
                      onClick={() =>
                        toggleOption(
                          typeof opt === "string" ? opt : opt
                        )
                      }
                      className={`px-5 py-3 rounded-full border flex items-center gap-2 transition-all duration-200 ${
                        active
                          ? "bg-lime-500 text-black border-lime-500 shadow-[0_0_18px_rgba(163,230,53,0.45)] scale-[1.03]"
                          : "border-white/20 hover:border-lime-400 hover:bg-white/5"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 ${
                            active ? "text-black" : "text-lime-400"
                          }`}
                        />
                      )}
                      {label.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  Array.isArray(selected) &&
                  selected.length === 0
                }
                className="self-end px-8 py-3 rounded-xl bg-lime-500 text-black font-semibold hover:bg-lime-400 hover:shadow-[0_0_20px_rgba(163,230,53,0.5)] disabled:opacity-40 disabled:shadow-none mt-4 transition-all duration-200"
              >
                {t("onboarding.continue")} →
              </button>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
}