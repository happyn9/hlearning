import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, X, Send } from "lucide-react";

// ⚠️ Hypothèse sur la forme de ton client API existant (celui utilisé dans
// CourseInfo.jsx : `api(\`/courses/${id}\`)`). Je suppose qu'il accepte un
// objet d'options fetch-like en 2e argument pour le POST. Partage-moi
// `services/api.js` si la signature est différente, j'ajuste l'appel.
import api from "../services/api";

/* ============================================================
   Un rond avec anneaux qui pulsent — même langage visuel que
   CourseLoader et la page offline, réutilisé ici comme "avatar"
   de l'assistant pendant qu'il réfléchit.
   ============================================================ */
function ThinkingAvatar() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-indigo-500/40"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: i * 0.8 }}
        />
      ))}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
        <Sparkles size={14} className="text-white" />
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
      <Sparkles size={14} className="text-white" />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1.5 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const data = await api("/ai/chat", {
        method: "POST",
        data: { message },
      });

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const detail = err?.message || t("ai_chat.generic_error", "Something went wrong. Please try again.");
      setMessages((prev) => [...prev, { role: "assistant", content: detail, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center"
            style={{ boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-label={t("ai_chat.open", "Open AI assistant")}
          >
            <Sparkles size={22} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)]
                       bg-[#1a1c1f] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-gradient-to-r from-indigo-950/40 to-purple-950/40">
              <div className="flex items-center gap-2.5">
                <Avatar />
                <div>
                  <p className="text-sm font-semibold text-white leading-none">
                    {t("ai_chat.title", "H-Learning AI")}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t("ai_chat.subtitle", "Your course assistant")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-white transition p-1"
                aria-label={t("ai_chat.close", "Close")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <Avatar />
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                    {t(
                      "ai_chat.empty_state",
                      "Ask me anything about your course — I'm here to help you understand it."
                    )}
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && <Avatar />}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
                      ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md"
                          : msg.isError
                          ? "bg-red-500/10 border border-red-500/30 text-red-300 rounded-bl-md"
                          : "bg-[#232529] border border-slate-800 text-slate-200 rounded-bl-md"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <ThinkingAvatar />
                  <div className="bg-[#232529] border border-slate-800 rounded-2xl rounded-bl-md px-3.5 py-3 flex items-center">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800">
              <div className="flex items-end gap-2 bg-[#111315] border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("ai_chat.placeholder", "Type your question…")}
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none py-1 max-h-24"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600
                             flex items-center justify-center disabled:opacity-40 transition"
                  aria-label={t("ai_chat.send", "Send")}
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}