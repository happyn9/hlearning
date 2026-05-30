import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function OTPModal({
  otp,
  setOtp,
  verify,
  close,
  error,
  loading
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-neutral-900 space-y-8 rounded-2xl p-8 w-full max-w-sm text-white"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >

        <h2 className="text-xl font-semibold text-center">
          {t("otp.title")}
        </h2>

        <p className="text-sm text-neutral-400 text-center">
          {t("otp.subtitle")}
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full text-center tracking-[10px] text-lg py-3 rounded-lg bg-neutral-800"
        />

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <button
          onClick={verify}
          disabled={loading}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold"
        >
          {loading ? t("otp.verifying") : t("otp.verify")}
        </button>

        <button
          onClick={close}
          className="w-full text-sm text-neutral-400"
        >
          {t("otp.cancel")}
        </button>

      </motion.div>
    </motion.div>
  );
}