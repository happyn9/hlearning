import { AnimatePresence, motion } from "framer-motion";
import { Download, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { usePwa } from "../hooks/usePwa";
import { useTranslation } from "react-i18next";

const sf = { fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif" };

export default function PwaBanner() {
  const { canInstall, promptInstall, needRefresh, applyUpdate } = usePwa();
  const [dismissed, setDismissed] = useState(false);
  const {t}=useTranslation();

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-999 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg"
          style={{ ...sf, background: "#1D1D1F", color: "#fff" }}
        >
          <RefreshCw size={16} />
          <span className="text-[13.5px]">{t("pwa.new")}</span>
          <button
            onClick={applyUpdate}
            className="text-[13px] font-semibold px-3 py-1 rounded-full"
            style={{ background: "#0071E3" }}
          >
            {t("pwa.update")}
          </button>
        </motion.div>
      )}

      {canInstall && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-998 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg"
          style={{ ...sf, background: "#fff", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <Download size={16} style={{ color: "#0071E3" }} />
          <span className="text-[13.5px]" style={{ color: "#1D1D1F" }}>
            {t("pwa.install")}
          </span>
          <button
            onClick={promptInstall}
            className="text-[13px] font-semibold px-3 py-1 rounded-full text-white"
            style={{ background: "#0071E3" }}
          >
            {t("pwa.install")}
          </button>
          <button onClick={() => setDismissed(true)}>
            <X size={14} style={{ color: "#86868B" }} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}