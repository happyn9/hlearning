import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useUser } from "../../context/UserContext";
import OTPModal from "./OTPModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const INITIAL_SKELETON_DURATION = 800; // uniquement pour le skeleton au montage

export default function Form() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const { t } = useTranslation();

  const [mode, setMode] = useState("login");
  const [initialLoading, setInitialLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [remember, setRemember] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= INITIAL SKELETON (montage uniquement) ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, INITIAL_SKELETON_DURATION);
    return () => clearTimeout(timer);
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("auth.fillFields"));
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
        remember_me: remember,
      });

      setShowOTP(true);
    } catch (err) {
      console.error("LOGIN ERR:", err);
      setError(err.message || t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError(t("auth.fillFields"));
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setShowOTP(true);
    } catch (err) {
      console.error("REGISTER ERR:", err);
      setError(err.message || t("auth.registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP ================= */
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
      if (!user.onboarding_completed) {
        redirect = "/onboarding";
      } else if (user.role === "admin") {
        redirect = "/admin/dashboard";
      } else if (user.role === "teacher") {
        redirect = "/teacher/dashboard";
      }

      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err?.detail || err?.message || t("auth.otpInvalid"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE =================
     useGoogleLogin déclenche le flux Google directement au clic,
     sur un vrai bouton stylé — plus de bouton officiel invisible
     à superposer, donc plus de clics "morts". */
  const handleGoogleSuccess = async (accessToken) => {
    setError("");
    setLoading(true);

    try {
      // ⚠️ adapter le backend : il doit accepter un access_token
      // et récupérer les infos via l'API userinfo de Google,
      // au lieu de vérifier un credential (JWT id_token).
      await api.post("/auth/google", {
        access_token: accessToken,
      });

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

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f]/95 text-white flex flex-col">
      {/* HEADER */}
      <header className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold">H-learning</h1>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          {/* TITLE */}
          <h2 className="text-2xl sm:text-3xl text-center font-semibold">
            {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h2>

          {/* FORM */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className={`space-y-4 transition-opacity duration-300 ${
              showSkeleton ? "opacity-60 pointer-events-none" : "opacity-100"
            }`}
          >
            {showSkeleton ? (
              <>
                {mode === "register" && <SkeletonInput />}
                <SkeletonInput />
                <SkeletonInput />
                <SkeletonButton />
              </>
            ) : (
              <>
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
                      className="w-full px-5 py-3 text-base rounded-full bg-transparent border"
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
                    className="w-full px-5 py-3 text-base rounded-full bg-transparent border"
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
                    className="w-full px-5 py-3 text-base rounded-full bg-transparent border"
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
                  className="w-full py-3 rounded-full bg-white text-black font-semibold active:scale-95 transition disabled:opacity-60"
                >
                  {loading
                    ? t("auth.loading")
                    : mode === "login"
                    ? t("auth.continue")
                    : t("auth.create")}
                </button>
              </>
            )}
          </form>

          {/* SWITCH */}
          <p className="text-center text-sm text-neutral-400">
            {mode === "login" ? t("auth.noAccount") : t("auth.alreadyAccount")}
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "register" : "login");
              }}
              className="ml-2 underline py-1 px-0.5 inline-block"
            >
              {mode === "login" ? t("auth.signup") : t("auth.signin")}
            </button>
          </p>

          {/* GOOGLE — vrai bouton, stylé directement, plus d'overlay.
              Le clic appelle googleLogin() qui ouvre le flux Google
              (popup) immédiatement, sans passer par un iframe caché. */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={loading}
            className="group relative w-full h-10 flex items-center justify-center gap-3 rounded-full font-semibold text-[14px] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.99] disabled:opacity-60"
            style={{
              background:
                "linear-gradient(180deg, #2a2a2a 0%, #1c1c1c 55%, #141414 100%)",
              boxShadow: `
                0 1px 0 0 rgba(255,255,255,0.08) inset,
                0 -1px 0 0 rgba(0,0,0,0.6) inset,
                0 10px 24px -8px rgba(0,0,0,0.65),
                0 2px 6px rgba(0,0,0,0.4),
                0 0 0 1px rgba(255,255,255,0.06)
              `,
              color: "#F5F5F5",
            }}
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full bg-white shrink-0"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              <GoogleGlyph size={15} />
            </span>
            {t("auth.continueWithGoogle")}
          </button>
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
  );
}

/* ================= GOOGLE GLYPH ================= */

function GoogleGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.5-5.9 7.7-11 7.7-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l5.9 4.3C13.9 15.1 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C34.5 6.1 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2 14-5.4l-6.4-5.4c-2 1.4-4.6 2.3-7.6 2.3-5.1 0-9.4-3.2-11-7.7l-6.2 4.8C10 39.9 16.5 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.4 5.4C41.4 35.7 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

/* ================= SKELETON ================= */

function SkeletonInput() {
  return (
    <div className="h-12 w-full rounded-full bg-white/5 relative overflow-hidden border border-white/10">
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function SkeletonButton() {
  return (
    <div className="h-12 w-full rounded-full bg-white/10 relative overflow-hidden border border-white/10">
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}