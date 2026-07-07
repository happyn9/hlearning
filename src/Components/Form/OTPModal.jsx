import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../../services/api";

export default function OTPModal({ otp, setOtp, verify, close, error, loading, email }) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(300);
  const [resendCd, setResendCd] = useState(60);
  const [resendMsg, setResendMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setInterval(() => setResendCd((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendCd]);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await api.post("/auth/resend-otp", { email });
      setCountdown(300);
      setResendCd(60);
      setResendMsg(t("otp.resendSuccess"));
    } catch {
      setResendMsg(t("otp.resendError"));
    } finally {
      setResendLoading(false);
    }
  };

  const expired = countdown <= 0;
  const pct = Math.round((countdown / 300) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 h-screen w-full bg-black flex items-center justify-center overflow-hidden p-3 sm:p-6 lg:p-10"
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[1300px] mx-auto rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden border border-white/[0.07] bg-[#121212] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row h-[90vh] lg:h-[92vh]"
      >
        {/* ================= ONGLET GAUCHE — PETIT CHAMP OTP ================= */}
        <div className="hidden lg:flex lg:w-[34%] relative overflow-hidden flex-col items-center justify-center px-10 border-r border-white/[0.06] bg-[#141414]">
          <div
            className="pointer-events-none absolute top-8 left-8 w-32 h-20 opacity-40"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
              maskImage: "radial-gradient(ellipse at top left, black 40%, transparent 75%)",
            }}
          />
          <div className="pointer-events-none absolute -top-28 -left-20 w-[320px] h-[320px] rounded-full bg-[#378ADD]/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-90px] right-[-50px] w-[280px] h-[280px] rounded-full bg-[#1D9E75]/[0.08] blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-7"
              style={{ background: "rgba(55,138,221,0.12)", border: "0.5px solid rgba(55,138,221,0.25)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 8l10 6 10-6" />
              </svg>
            </div>

            <div className="relative">
              <div className="grid grid-cols-3 gap-2" onClick={() => inputRef.current?.focus()}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-11 h-14 rounded-xl flex items-center justify-center text-lg font-semibold text-white cursor-text transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border:
                        otp.length === i
                          ? "1px solid #378ADD"
                          : otp[i]
                          ? "1px solid rgba(255,255,255,0.25)"
                          : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {otp[i] || ""}
                  </div>
                ))}
              </div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="absolute inset-0 opacity-0 cursor-text"
                autoComplete="one-time-code"
              />
            </div>

            <div className="w-[190px] mt-6">
              <div className="flex justify-center items-center gap-1.5 mb-2">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {expired ? t("otp.expired") : t("otp.expiresIn")}
                </span>
                {!expired && (
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: countdown <= 60 ? "#E24B4A" : "rgba(255,255,255,0.75)" }}
                  >
                    {fmt(countdown)}
                  </span>
                )}
              </div>
              <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: countdown <= 60 ? "#E24B4A" : "#378ADD" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ONGLET DROIT — TEXTES + ACTIONS ================= */}
        <div className="flex-1 flex flex-col h-full bg-[#141414] overflow-y-auto">
          <header className="p-4 sm:p-6 lg:hidden">
            <button
              type="button"
              onClick={close}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {t("otp.back")}
            </button>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 sm:px-10 lg:px-16 py-10">
            <div className="w-full max-w-md space-y-7">
              <button
                type="button"
                onClick={close}
                className="hidden lg:flex mb-1 items-center gap-1.5 text-sm"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                {t("otp.back")}
              </button>

              <div>
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white">
                  {t("otp.title")}
                </h2>
                <p className="mt-3 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {t("otp.subtitlePrefix")}{" "}
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{email}</span>
                  {t("otp.subtitleSuffix")}
                </p>
              </div>

              {/* Champ OTP mobile (l'onglet gauche est masqué en < lg) */}
              <div className="lg:hidden relative">
                <div className="flex gap-2.5 justify-center" onClick={() => inputRef.current?.focus()}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-14 rounded-2xl flex items-center justify-center text-xl font-semibold text-white cursor-text"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border:
                          otp.length === i
                            ? "1px solid #378ADD"
                            : otp[i]
                            ? "1px solid rgba(255,255,255,0.25)"
                            : "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {otp[i] || ""}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center items-center gap-1.5">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {expired ? t("otp.expired") : t("otp.expiresIn")}
                  </span>
                  {!expired && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: countdown <= 60 ? "#E24B4A" : "rgba(255,255,255,0.75)" }}
                    >
                      {fmt(countdown)}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}
              {resendMsg && (
                <p className="text-sm" style={{ color: "#1D9E75" }}>
                  {resendMsg}
                </p>
              )}

              <button
                onClick={verify}
                disabled={loading || otp.length !== 6 || expired}
                className="w-full py-3.5 rounded-full bg-white text-black font-semibold active:scale-95 transition disabled:opacity-40"
              >
                {loading ? t("otp.verifying") : t("otp.verify")}
              </button>

              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "rgba(255,255,255,0.35)" }}>
                  {resendCd > 0 ? t("otp.resendAvailableInline", { count: resendCd }) : t("otp.noCode")}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCd > 0 || resendLoading}
                  className="underline"
                  style={{
                    color: resendCd > 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.65)",
                    background: "none",
                    border: "none",
                    cursor: resendCd > 0 ? "default" : "pointer",
                  }}
                >
                  {resendLoading ? t("otp.resending") : t("otp.resend")}
                </button>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t("otp.spamNote")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}