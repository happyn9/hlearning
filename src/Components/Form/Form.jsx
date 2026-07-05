import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useUser } from "../../context/UserContext";
import OTPModal from "./OTPModal";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const INITIAL_SKELETON_DURATION = 800; // uniquement pour le skeleton au montage

export default function Auth() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const { t } = useTranslation();

  const [mode, setMode] = useState("login");
  const [initialLoading, setInitialLoading] = useState(true); // skeleton au montage seulement

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [remember, setRemember] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false); // reflète la vraie requête en cours
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

  /* ================= GOOGLE ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      const user = await refreshUser();

      if (!user) {
        setError(t("auth.googleFailed"));
        return;
      }

      let redirect = "/";
      if (!user.onboarding_completed) redirect = "/onboarding";

      navigate(redirect, { replace: true });
    } catch {
      setError(t("auth.googleFailed"));
    } finally {
      setLoading(false);
    }
  };

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

          {/* GOOGLE */}
          <div className="flex p-1 rounded-full justify-center w-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
            <div className="max-w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError(t("auth.googleFailed"))}
              />
            </div>
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