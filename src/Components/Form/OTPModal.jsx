import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

export default function OTPModal({ otp, setOtp, verify, close, error, loading, email }) {
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
      setResendMsg("Nouveau code envoyé !");
    } catch {
      setResendMsg("Échec de l'envoi.");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-md rounded-[28px] p-8 sm:p-10 flex flex-col gap-7 relative"
        style={{ background: "#141414", border: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        {/* Back / close — même langage que le bouton "Retour" du form */}
        <button
          type="button"
          onClick={close}
          className="absolute left-6 top-6 sm:left-8 sm:top-8 flex items-center gap-1.5 text-sm"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Retour
        </button>

        {/* Icône */}
        <div className="flex justify-center pt-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(55,138,221,0.12)", border: "0.5px solid rgba(55,138,221,0.25)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M2 8l10 6 10-6" />
            </svg>
          </div>
        </div>

        {/* Header — même échelle typo que welcomeBack/createAccount */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Vérifiez votre boîte mail
          </h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Nous avons envoyé un code à 6 chiffres à
            <br />
            <span style={{ color: "rgba(255,255,255,0.75)" }}>{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="relative">
          <div className="flex gap-2.5 justify-center cursor-text" onClick={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-14 rounded-2xl flex items-center justify-center text-2xl font-medium text-white transition-colors"
                style={{
                  background: "transparent",
                  border:
                    otp.length === i
                      ? "1px solid #378ADD"
                      : otp[i]
                      ? "1px solid rgba(255,255,255,0.25)"
                      : "1px solid rgba(255,255,255,0.15)",
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

        {/* Timer */}
        <div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {expired ? "Code expiré" : "Expire dans"}
            </span>
            {!expired && (
              <span
                className="text-xs font-medium"
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

        {/* Messages */}
        {error && (
          <p role="alert" className="text-sm text-center text-red-400">
            {error}
          </p>
        )}
        {resendMsg && (
          <p className="text-sm text-center" style={{ color: "#1D9E75" }}>
            {resendMsg}
          </p>
        )}

        {/* Verify — bouton pilule blanc identique au form */}
        <button
          onClick={verify}
          disabled={loading || otp.length !== 6 || expired}
          className="w-full py-3.5 rounded-full bg-white text-black font-semibold active:scale-95 transition disabled:opacity-40"
        >
          {loading ? "Vérification..." : "Vérifier"}
        </button>

        {/* Resend */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCd > 0 || resendLoading}
            className="text-sm underline transition-colors"
            style={{
              color: resendCd > 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.55)",
              background: "none",
              border: "none",
              cursor: resendCd > 0 ? "default" : "pointer",
            }}
          >
            {resendLoading ? "Envoi..." : "Renvoyer le code"}
          </button>
          {resendCd > 0 && (
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              Disponible dans {resendCd}s
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}