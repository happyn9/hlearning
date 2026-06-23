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
    const t = setInterval(() => setCountdown(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setInterval(() => setResendCd(p => p - 1), 1000);
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
      setResendMsg("New code sent!");
    } catch {
      setResendMsg("Failed to resend.");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-sm mx-4 rounded-3xl p-10 flex flex-col gap-7"
        style={{ background: "#141416", border: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(55,138,221,0.12)", border: "0.5px solid rgba(55,138,221,0.25)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <path d="M2 8l10 6 10-6"/>
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-white text-xl font-medium mb-2">Check your inbox</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            We sent a 6-digit code to<br />
            <span style={{ color: "rgba(255,255,255,0.75)" }}>{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="relative">
          <div className="flex gap-2 justify-center cursor-text" onClick={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}
                className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-medium text-white transition-all"
                style={{
                  background: "#1e1e22",
                  border: otp.length === i
                    ? "1px solid #378ADD"
                    : otp[i] ? "0.5px solid rgba(255,255,255,0.2)" : "0.5px solid rgba(255,255,255,0.08)",
                  fontFamily: "var(--font-mono)"
                }}>
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
              {expired ? "Code expired" : "Expires in"}
            </span>
            {!expired && (
              <span className="text-xs font-medium font-mono"
                style={{ color: countdown <= 60 ? "#E24B4A" : "#fff" }}>
                {fmt(countdown)}
              </span>
            )}
          </div>
          <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: countdown <= 60 ? "#E24B4A" : "#378ADD" }} />
          </div>
        </div>

        {/* Messages */}
        {error && <p className="text-sm text-center" style={{ color: "#E24B4A" }}>{error}</p>}
        {resendMsg && <p className="text-sm text-center" style={{ color: "#1D9E75" }}>{resendMsg}</p>}

        {/* Verify button */}
        <button
          onClick={verify}
          disabled={loading || otp.length !== 6 || expired}
          className="w-full py-3.5 rounded-xl font-medium text-sm transition-all active:scale-98"
          style={{ background: "#fff", color: "#0c0c0e", opacity: (otp.length !== 6 || expired) ? 0.35 : 1 }}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendCd > 0 || resendLoading}
            className="text-xs underline transition-colors"
            style={{
              color: resendCd > 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)",
              background: "none", border: "none", cursor: resendCd > 0 ? "default" : "pointer"
            }}>
            {resendLoading ? "Sending..." : "Resend code"}
          </button>
          {resendCd > 0 && (
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Available in {resendCd}s
            </p>
          )}
        </div>

        {/* Cancel */}
        <button onClick={close}
          className="text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none" }}>
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}