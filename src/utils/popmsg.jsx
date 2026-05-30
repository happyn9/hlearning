import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";

/* ================= INTERNAL STATE ================= */
let root = null;
let container = null;

/* ================= COMPONENT ================= */
function Toast({ message, type, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`
          fixed top-6 right-6 z-9999
          px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${
            type === "success"
              ? "bg-lime-500 text-black"
              : type === "error"
              ? "bg-red-500 text-white"
              : "bg-neutral-800 text-white"
          }
        `}
        onClick={onClose}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

/* ================= API ================= */
export default function popmsg(
  message,
  type = "info",
  duration = 3000
) {
  if (!container) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  }

  const close = () => {
    root.render(null);
  };

  root.render(
    <Toast message={message} type={type} onClose={close} />
  );

  setTimeout(close, duration);
}
