import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import api from "../services/api";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6">
      <div
        className={`max-w-6xl w-full grid ${
          currentStep === "StepPrivacy"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 lg:grid-cols-2"
        } gap-10`}
      >
        {/* LEFT */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl space-y-8">
          {/* Progress */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h1 className="text-3xl font-bold">
            {t(data.titleKey)}
          </h1>

          {currentStep === "StepPrivacy" ? (
            <>
              {/* Privacy Card */}
              <div className="h-96 overflow-y-auto p-6 bg-neutral-900 rounded-2xl shadow-xl border border-white/20 space-y-6 scrollbar-thin scrollbar-thumb-lime-500 scrollbar-track-neutral-700 mt-4">
                <div>
                  <h3 className="text-lime-400 font-bold text-lg mb-2">
                    {t("onboarding.privacy.collect.title")}
                  </h3>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {t("onboarding.privacy.collect.desc")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lime-400 font-bold text-lg mb-2">
                    {t("onboarding.privacy.use.title")}
                  </h3>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {t("onboarding.privacy.use.desc")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lime-400 font-bold text-lg mb-2">
                    {t("onboarding.privacy.rights.title")}
                  </h3>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {t("onboarding.privacy.rights.desc")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lime-400 font-bold text-lg mb-2">
                    {t("onboarding.privacy.terms.title")}
                  </h3>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {t("onboarding.privacy.terms.desc")}
                  </p>
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex gap-3 items-center mt-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={toggleOption}
                  className="w-6 h-6 accent-lime-500 rounded-md border border-white/20"
                />

                <span className="text-white text-base">
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
                className="w-full py-4 mt-4 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-600 transition-all duration-300 disabled:opacity-50"
              >
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

                  return (
                    <button
                      key={label}
                      onClick={() =>
                        toggleOption(
                          typeof opt === "string" ? opt : opt
                        )
                      }
                      className={`px-5 py-3 rounded-full border transition ${
                        active
                          ? "bg-lime-500 text-black border-lime-500"
                          : "border-white/20 hover:border-lime-400"
                      }`}
                    >
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
                className="self-end px-8 py-3 rounded-xl bg-lime-500 text-black font-semibold hover:bg-lime-600 disabled:opacity-40 mt-4"
              >
                {t("onboarding.continue")} →
              </button>
            </>
          )}
        </div>

        {/* RIGHT IMAGE */}
        {currentStep !== "StepPrivacy" && (
          <div className="hidden lg:flex items-center justify-center">
            <img
              src={data.image}
              alt="Onboarding"
              className="max-h-80 drop-shadow-2xl animate-fade-in rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}