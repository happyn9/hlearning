import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { useUser } from "../../context/UserContext";
import OTPModal from "./OTPModal";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const LOADING_DURATION = 1500; // 🔥 durée unique de chargement (1.5s)

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useUser();
  const { t } = useTranslation();

  const [mode, setMode] = useState("login");
  const [pageLoading, setPageLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [remember, setRemember] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOADING CONTROL (IMPORTANT) ================= */
  const triggerPageLoading = (time = LOADING_DURATION) => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, time);
  };

  /* initial skeleton */
  useEffect(() => {
    triggerPageLoading(LOADING_DURATION);
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("auth.fillFields"));
      return;
    }

    triggerPageLoading(LOADING_DURATION); // 🔥 loading UX pendant action
    setLoading(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
        remember_me:remember,
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

    triggerPageLoading(LOADING_DURATION);
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
    }finally {
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

    // ✅ Guard
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
  return (
    <div className="min-h-screen w-full bg-[#0f0f0f]/95 text-white flex flex-col">

      {/* HEADER */}
      <h1 className="p-6 text-2xl font-bold">H-learning</h1>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-6">

          {/* TITLE */}
          <h1 className="text-3xl text-center font-semibold">
            {mode === "login"
              ? t("auth.welcomeBack")
              : t("auth.createAccount")}
          </h1>

          {/* FORM */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className={`space-y-4 transition-opacity duration-700 ${
              pageLoading ? "opacity-60 pointer-events-none" : "opacity-100"
            }`}
          >
            {pageLoading ? (
              <>
                {mode === "register" && <SkeletonInput />}
                <SkeletonInput />
                <SkeletonInput />
                <SkeletonButton />
              </>
            ) : (
              <>
                {mode === "register" && (
                  <input
                    type="text"
                    placeholder={t("auth.fullName")}
                    className="w-full px-5 py-3 rounded-full bg-transparent border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}

                <input
                  type="email"
                  placeholder={t("auth.email")}
                  className="w-full px-5 py-3 rounded-full bg-transparent border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder={t("auth.password")}
                  className="w-full px-5 py-3 rounded-full bg-transparent border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-white text-black font-semibold active:scale-95 transition"
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
            {mode === "login"
              ? t("auth.noAccount")
              : t("auth.alreadyAccount")}

            <button
              onClick={() =>
                setMode(mode === "login" ? "register" : "login")
              }
              className="ml-2 underline"
            >
              {mode === "login"
                ? t("auth.signup")
                : t("auth.signin")}
            </button>
          </p>

          {/* GOOGLE */}
          <div className="flex p-1 rounded-full justify-center w-full bg-white/5 backdrop-blur-md border border-white/10">
            <GoogleLogin
              onClick={() => triggerPageLoading(LOADING_DURATION)}   // 🔥 IMPORTANT
              
onSuccess={async (credentialResponse) => {
  try {
    triggerPageLoading(LOADING_DURATION);

    await api.post("/auth/google", {
      token: credentialResponse.credential,
    });

    const user = await refreshUser();

    // ✅ Guard : si user est null (cookie non reçu, etc.)
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
}}
              onError={() => setError(t("auth.googleFailed"))}
            />
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