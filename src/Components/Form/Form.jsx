import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useUser } from "../../context/UserContext";
import OTPModal from "./OTPModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const INITIAL_SKELETON_DURATION = 800;



const COLORS = {
  ink: "#1D1D1F",
  gray: "#86868B",
  hairline: "rgba(0,0,0,0.08)",
  surface: "rgba(255,255,255,0.82)",
  surfaceSolid: "#FFFFFF",
  blue: "#0071E3",
  blueHover: "#0077ED",
  blueTint: "rgba(0,113,227,0.08)",
};

const HLearningMark = () => (
  <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
    <path
      d="M20 36C20 36 8 29 8.5 19.5C9 12.5 15 10 15 10C13.5 15 17 17 17.5 13.5C18 10 16.5 6.5 20 5C19 10 23 12.5 23.5 17C25 12.5 26 8 24.5 5C29 10 28 17 26.5 21.5C28 29 20 36 20 36Z"
      stroke={COLORS.ink}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function Form() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const { t, i18n } = useTranslation();

  const [mode, setMode] = useState("login");
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState("social");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), INITIAL_SKELETON_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("auth.fillFields"));
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password, remember_me: remember });
      setShowOTP(true);
    } catch (err) {
      console.error("LOGIN ERR:", err);
      setError(err.message || t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError(t("auth.fillFields"));
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, language: i18n.language });
      setShowOTP(true);
    } catch (err) {
      console.error("REGISTER ERR:", err);
      setError(err.message || t("auth.registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp, remember_me: remember });
      const user = await refreshUser();
      if (!user) {
        setError(t("auth.otpInvalid"));
        return;
      }
      let redirect = "/";
      if (!user.onboarding_completed) redirect = "/onboarding";
      else if (user.role === "admin") redirect = "/admin/dashboard";
      else if (user.role === "teacher") redirect = "/teacher/dashboard";
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err?.detail || err?.message || t("auth.otpInvalid"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/google", { access_token: accessToken });
      const user = await refreshUser();
      if (!user) {
        setError(t("auth.googleFailed"));
        return;
      }
      let redirect = "/";
      if (!user.onboarding_completed) redirect = "/onboarding";
      navigate(redirect, { replace: true });
    } catch (err) {
      console.error("GOOGLE ERR:", err);
      setError(t("auth.googleFailed"));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleSuccess(tokenResponse.access_token),
    onError: () => setError(t("auth.googleFailed")),
  });

  const showSkeleton = initialLoading;

  const switchMode = () => {
    setError("");
    setMode(mode === "login" ? "register" : "login");
  };

  const testimonials = [
    { title: t("auth.marketing.t0Title", "Pédagogie claire"), quote: t("auth.marketing.t0Quote", "Chaque module est découpé de façon logique, facile à suivre.") },
    { title: t("auth.marketing.t1Title", "Progrès visible"), quote: t("auth.marketing.t1Quote", "Je vois enfin où j'en suis chaque semaine.") },
    { title: t("auth.marketing.t2Title", "Cours clairs"), quote: t("auth.marketing.t2Quote", "Les leçons sont bien structurées et faciles à suivre.") },
    { title: t("auth.marketing.t3Title", "Support réactif"), quote: t("auth.marketing.t3Quote", "Une question, une réponse en quelques minutes, jamais bloqué.") },
    { title: t("auth.marketing.t4Title", "Certificats utiles"), quote: t("auth.marketing.t4Quote", "Mon certificat m'a vraiment aidé en entretien.") },
  ];

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden p-3 sm:p-6 lg:p-10">
      {/* injecte le keyframe marquee une seule fois */}
      <style>{`
        @keyframes hlearning-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hlearning-marquee-track {
          animation: hlearning-marquee 32s linear infinite;
        }
        .hlearning-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ================= CARTE CENTRÉE ================= */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden border border-white/[0.07] bg-[#121212] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row h-[90vh] lg:h-[92vh]">
        {/* ================= LEFT — MARKETING PANEL (desktop only) ================= */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center px-10 xl:px-16 py-16 border-r border-white/[0.06]">
          <div
            className="pointer-events-none absolute top-10 left-10 w-40 h-24 opacity-40"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
              maskImage: "radial-gradient(ellipse at top left, black 40%, transparent 75%)",
            }}
          />
          <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#378ADD]/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-120px] right-[-60px] w-[380px] h-[380px] rounded-full bg-[#1D9E75]/[0.08] blur-3xl" />

          <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
            <div
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full mb-2"
              style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}
            >
              {[
                { icon: "🎓", label: t("auth.marketing.badge1", "50+ écoles") },
                { icon: "👩‍💻", label: t("auth.marketing.badge2", "10k+ apprenants") },
                { icon: "📜", label: t("auth.marketing.badge3", "Certifié") },
              ].map((b, i) => (
                <span
                  key={b.label}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 ${i > 0 ? "border-l border-white/10" : ""}`}
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  <span aria-hidden="true">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold leading-[1.05] tracking-tight">
              {t("auth.marketing.title", "Votre studio d'apprentissage tout-en-un")}
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t(
                "auth.marketing.subtitle",
                "Suivez vos cours, vos exercices et votre progression au même endroit. Décrivez ce que vous voulez apprendre, H-learning s'occupe du reste."
              )}
            </p>

            <div
              className="mt-6 inline-flex items-center gap-3 px-3 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex -space-x-1.5">
                {["#378ADD", "#1D9E75", "#E2A93A", "#B15CDE"].map((c) => (
                  <span key={c} className="w-5 h-5 rounded-full border-2 border-[#121212]" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                {t("auth.marketing.moreCourses", "+30 formations ce trimestre")}
              </span>
            </div>

            {/* ================= CAROUSEL EN BOUCLE (marquee) ================= */}
            <div className="mt-14 w-full -mx-10 xl:-mx-16 overflow-hidden">
              <div className="flex gap-3 w-max hlearning-marquee-track">
                {[...testimonials, ...testimonials].map((c, i) => (
                  <TestimonialCard key={i} title={c.title} quote={c.quote} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT — AUTH PANEL ================= */}
        <div className="flex-1 flex flex-col min-h-full bg-[#141414]">
          <header className="p-4 flex items-center gap-2 sm:p-6 lg:hidden">
            <HLearningMark />
            <h1 className="text-xl sm:text-2xl font-bold text-white">H-learning</h1>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 sm:px-10 py-10">
            <div className="w-full max-w-md space-y-7">
              {step === "social" && !showSkeleton ? (
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white">
                    {t("auth.headline", "Inscrivez-vous ou connectez-vous")}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {t("auth.headlineSubtitle", "Commencez à apprendre en quelques secondes.")}
                  </p>
                </div>
              ) : (
                step === "email" &&
                !showSkeleton && (
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {mode === "login"
                        ? t("auth.subtitleLogin", "Connectez-vous pour continuer votre apprentissage.")
                        : t("auth.subtitleRegister", "Créez votre compte en quelques secondes.")}
                    </p>
                  </div>
                )
              )}

              {showSkeleton ? (
                <SkeletonBlock />
              ) : (
                <AnimatePresence mode="wait">
                  {step === "social" ? (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-7"
                    >
                      <div className="space-y-3.5">
                        {error && (
                          <p role="alert" className="text-red-400 text-sm text-center">
                            {error}
                          </p>
                        )}

                        <SocialButton
                          variant="light"
                          label={t("auth.continueWithGoogle")}
                          icon={<GoogleGlyph size={18} />}
                          onClick={() => googleLogin()}
                          disabled={loading}
                        />
                        <SocialButton
                          variant="dark"
                          label={t("auth.continueWithApple", "Continuer avec Apple")}
                          icon={<AppleGlyph size={18} light />}
                          disabled
                          comingSoon={t("auth.comingSoon", "Bientôt")}
                        />
                        <SocialButton
                          variant="dark"
                          label={t("auth.continueWithMicrosoft", "Continuer avec Microsoft")}
                          icon={<MicrosoftGlyph size={18} />}
                          disabled
                          comingSoon={t("auth.comingSoon", "Bientôt")}
                        />

                        <div className="flex items-center gap-3 py-1">
                          <span className="flex-1 h-px bg-white/10" />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {t("auth.or", "ou")}
                          </span>
                          <span className="flex-1 h-px bg-white/10" />
                        </div>

                        <SocialButton
                          variant="dark"
                          label={t("auth.continueWithEmail", "Continuer avec un e-mail")}
                          icon={<MailGlyph size={18} />}
                          onClick={() => setStep("email")}
                        />
                      </div>

                      <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <LockGlyph size={12} />
                        {t("auth.dataSecure", "Vos données sont en sécurité, sécurisées et totalement privées.")}
                      </p>

                      <p className="text-center text-xs leading-relaxed px-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {t("auth.agreePrefix", "En continuant, vous acceptez nos")}{" "}
                        <Link to="/terms" className="underline" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {t("auth.termsOfUse", "Conditions d'utilisation")}
                        </Link>{" "}
                        {t("auth.and", "et notre")}{" "}
                        <Link to="/privacy" className="underline" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {t("auth.privacyPolicy", "Politique de confidentialité")}
                        </Link>
                        {t("auth.agreeSuffix", ", et à recevoir des mises à jour produit et des offres.")}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setStep("social");
                        }}
                        className="mb-4 flex items-center gap-1.5 text-sm"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                        {t("auth.back", "Retour")}
                      </button>

                      <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
                        {mode === "register" && (
                          <div>
                            <label htmlFor="name" className="sr-only">
                              {t("auth.fullName")}
                            </label>
                            <input
                              id="name"
                              type="text"
                              autoComplete="name"
                              placeholder={t("auth.fullName")}
                              className="w-full px-5 py-3.5 text-base rounded-full bg-white/[0.03] text-white border border-white/15 focus:border-[#378ADD] outline-none transition-colors"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        )}

                        <div>
                          <label htmlFor="email" className="sr-only">
                            {t("auth.email")}
                          </label>
                          <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder={t("auth.email")}
                            className="w-full px-5 py-3.5 text-base rounded-full bg-white/[0.03] text-white border border-white/15 focus:border-[#378ADD] outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label htmlFor="password" className="sr-only">
                            {t("auth.password")}
                          </label>
                          <input
                            id="password"
                            type="password"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            placeholder={t("auth.password")}
                            className="w-full px-5 py-3.5 text-base rounded-full bg-white/[0.03] text-white border border-white/15 focus:border-[#378ADD] outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        {mode === "login" && (
                          <label className="flex items-center gap-2 text-sm text-neutral-400 select-none cursor-pointer px-1">
                            <input
                              type="checkbox"
                              checked={remember}
                              onChange={(e) => setRemember(e.target.checked)}
                              className="w-4 h-4 rounded accent-white"
                            />
                            {t("auth.rememberMe")}
                          </label>
                        )}

                        {error && (
                          <p role="alert" className="text-red-400 text-sm">
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 rounded-full bg-white text-black font-semibold active:scale-95 transition disabled:opacity-60"
                        >
                          {loading ? t("auth.loading") : mode === "login" ? t("auth.continue") : t("auth.create")}
                        </button>
                      </form>

                      <p className="mt-6 text-center text-sm text-neutral-400">
                        {mode === "login" ? t("auth.noAccount") : t("auth.alreadyAccount")}
                        <button type="button" onClick={switchMode} className="ml-2 underline py-1 px-0.5 inline-block text-white">
                          {mode === "login" ? t("auth.signup") : t("auth.signin")}
                        </button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* OTP */}
        <AnimatePresence>
          {showOTP && (
            <OTPModal
              otp={otp}
              setOtp={setOtp}
              verify={handleVerifyOTP}
              close={() => setShowOTP(false)}
              loading={loading}
              error={error}
              email={email}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= SOCIAL BUTTON ================= */

function SocialButton({ label, icon, onClick, disabled, comingSoon, variant = "dark" }) {
  const isLight = variant === "light";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={comingSoon ? comingSoon : undefined}
      className={`group relative w-full h-12 flex items-center justify-center gap-2.5 rounded-2xl font-medium text-[14px] transition-all duration-150 ${
        disabled ? "cursor-not-allowed opacity-40" : "active:scale-[0.99]"
      }`}
      style={
        isLight
          ? { background: "#ffffff", color: "#0c0c0e" }
          : { background: "#1c1c1e", color: "#F5F5F5", border: "1px solid rgba(255,255,255,0.06)" }
      }
    >
      <span className="flex items-center justify-center shrink-0">{icon}</span>
      {label}
      {comingSoon && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
        >
          {comingSoon}
        </span>
      )}
    </button>
  );
}

/* ================= ICONS ================= */

function GoogleGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.5-5.9 7.7-11 7.7-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.9 15.1 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C34.5 6.1 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 14-5.4l-6.4-5.4c-2 1.4-4.6 2.3-7.6 2.3-5.1 0-9.4-3.2-11-7.7l-6.2 4.8C10 39.9 16.5 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.4 5.4C41.4 35.7 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function AppleGlyph({ size = 16, light }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={light ? "#F5F5F5" : "#111"}
        d="M16.365 1.43c0 1.14-.417 2.06-1.25 2.76-.87.75-1.9 1.15-3.06 1.06-.05-1.1.42-2.13 1.24-2.85.83-.73 2-1.2 3.07-.97zM20.7 17.19c-.44 1.02-.97 2-1.6 2.93-.86 1.28-1.56 2.16-2.1 2.65-.83.79-1.72 1.19-2.68 1.21-.69.01-1.51-.2-2.47-.62-.96-.42-1.85-.62-2.66-.62-.85 0-1.76.2-2.73.62-.97.42-1.75.64-2.36.66-.92.04-1.83-.36-2.72-1.21-.58-.53-1.31-1.44-2.19-2.75-.94-1.4-1.71-3.03-2.31-4.9-.64-2.02-.96-3.98-.96-5.87 0-2.17.47-4.04 1.4-5.6.73-1.25 1.7-2.24 2.92-2.97 1.21-.72 2.53-1.1 3.94-1.13.73 0 1.68.23 2.86.68 1.17.45 1.93.68 2.26.68.25 0 1.09-.26 2.51-.79 1.35-.49 2.49-.69 3.42-.62 2.53.2 4.43 1.2 5.7 3-.6.36-1.12.8-1.56 1.32-1.04 1.19-1.55 2.51-1.55 3.96 0 1.61.55 2.95 1.65 4.01.49.48 1.05.85 1.66 1.11-.13.39-.28.77-.44 1.15z"
      />
    </svg>
  );
}

function MicrosoftGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function MailGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 8l10 6 10-6" />
    </svg>
  );
}

function LockGlyph({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/* ================= TESTIMONIAL ================= */

function TestimonialCard({ title, quote }) {
  return (
    <div
      className="rounded-2xl p-4 w-48 shrink-0 text-left"
      style={{ background: "rgba(255,255,255,0.035)", border: "0.5px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex gap-0.5 mb-2" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 20 20" fill="#F5B93D">
            <path d="M10 1.5l2.6 5.4 5.9.85-4.3 4.2 1 5.9-5.2-2.75-5.2 2.75 1-5.9-4.3-4.2 5.9-.85z" />
          </svg>
        ))}
      </div>
      <p className="text-sm font-medium mb-1 text-white">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
        {quote}
      </p>
    </div>
  );
}

/* ================= SKELETON ================= */

function SkeletonBlock() {
  return (
    <div className="space-y-3">
      <SkeletonPill />
      <SkeletonPill />
      <SkeletonPill />
      <SkeletonPill emphasis />
    </div>
  );
}

function SkeletonPill({ emphasis }) {
  return (
    <div className={`h-12 w-full rounded-2xl relative overflow-hidden border border-white/10 ${emphasis ? "bg-white/10" : "bg-white/5"}`}>
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}