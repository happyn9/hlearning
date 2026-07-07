import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineScreen({ children }) {
  const { isOnline, isChecking, recheck } = useOnlineStatus();
  const { t } = useTranslation();

  return (
    <>
      {children}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden px-6"
            style={{ background: "#0f1115" }}
          >
            {/* Halos ambiants */}
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 480,
                height: 480,
                top: "-14%",
                left: "-10%",
                background: "rgba(79, 70, 229, 0.18)",
                filter: "blur(90px)",
              }}
            />
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 380,
                height: 380,
                bottom: "-12%",
                right: "-8%",
                background: "rgba(147, 51, 234, 0.14)",
                filter: "blur(90px)",
              }}
            />

            <div className="relative z-10 max-w-sm w-full text-center">
              {/* Icône avec anneaux */}
              <div className="relative w-24 h-24 mx-auto mb-7 flex items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full animate-[ping-ring_2.2s_ease-out_infinite]"
                  style={{ border: "1px solid rgba(99,102,241,0.35)" }}
                />
                <span
                  className="absolute inset-0 rounded-full animate-[ping-ring_2.2s_ease-out_infinite]"
                  style={{ border: "1px solid rgba(99,102,241,0.35)", animationDelay: "1.1s" }}
                />
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(26,28,31,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #2a2d33",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path d="M1 1L23 23" stroke="#f4f4f5" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M8.5 16.5C10.5 14.7 13.5 14.7 15.5 16.5" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                    <path d="M5 13C8.5 9.9 15.5 9.9 19 13" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                    <path d="M1.5 9.5C7.5 4 16.5 4 22.5 9.5" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" opacity="0.3" />
                    <circle cx="12" cy="19.5" r="1.4" fill="#6366f1" />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-bold text-white mb-2.5 tracking-tight">
                {t("offline.title", "Pas de connexion")}
              </h1>
              <p className="text-sm leading-relaxed mb-7 max-w-xs mx-auto" style={{ color: "#8b93a3" }}>
                {t(
                  "offline.description",
                  "Vérifie ta connexion internet et réessaie. Certaines pages restent disponibles hors ligne."
                )}
              </p>

              <button
                onClick={recheck}
                disabled={isChecking}
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                  boxShadow: "0 6px 18px rgba(99,102,241,0.35)",
                }}
              >
                {isChecking ? t("offline.checking", "Vérification...") : t("offline.retry", "Réessayer")}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: "#5b6272" }}>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-[pulse-dot_1.6s_ease-in-out_infinite]"
                  style={{ background: "#f97373" }}
                />
                <span>{t("offline.searching", "Recherche de connexion…")}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ping-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>
    </>
  );
}