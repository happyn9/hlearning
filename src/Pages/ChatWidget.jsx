import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Sparkles, X, Send } from "lucide-react";
import api from "../services/api";

/* ============================================================
   Questions/réponses prédéfinies — pas d'appel API, ne consomment
   pas de quota. Servent aussi de "mode d'emploi" pour le nouvel
   utilisateur qui ouvre le chat pour la première fois.
   ============================================================ */
const QUICK_QA = {
  en: [
    {
      q: "How does the AI assistant work?",
      a: "I'm here to help you understand concepts from your courses. You get 10 free questions per month — subscribing to a plan with AI access unlocks more.",
    },
    {
      q: "How do I subscribe to a course?",
      a: "Open any course page and tap \"Subscribe\" — choose a plan (Standard or Premium) and pay via mobile money.",
    },
    {
      q: "What languages are supported?",
      a: "H-Learning works in English and French. You can switch anytime from the footer.",
    },
    {
      q: "I forgot my password, what do I do?",
      a: "Go to the login page and tap \"Forgot password\" — you'll get a reset code by email.",
    },
  ],
  fr: [
    {
      q: "Comment fonctionne l'assistant IA ?",
      a: "Je suis là pour t'aider à comprendre les concepts de tes cours. Tu as 10 questions gratuites par mois — un abonnement avec accès IA en débloque plus.",
    },
    {
      q: "Comment m'abonner à un cours ?",
      a: "Ouvre la page d'un cours et clique sur \"S'abonner\" — choisis un plan (Standard ou Premium) et paye via mobile money.",
    },
    {
      q: "Quelles langues sont supportées ?",
      a: "H-Learning fonctionne en français et en anglais. Tu peux changer à tout moment depuis le footer.",
    },
    {
      q: "J'ai oublié mon mot de passe, que faire ?",
      a: "Va sur la page de connexion et clique sur \"Mot de passe oublié\" — tu recevras un code de réinitialisation par email.",
    },
  ],
};

function ThinkingAvatar() {
  const COLORS = {
  pink: "#F472B6",
};
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
      <div style={{backgroundColor: COLORS.pink}} className="w-full h-full rounded-full flex items-center justify-center">
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";
  const quickQA = QUICK_QA[lang];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleQuickReply = (qa) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: qa.q },
      { role: "assistant", content: qa.a },
    ]);
  };

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
      const needsSubscription = err?.status === 402;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: detail, isError: true, needsSubscription },
      ]);
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

  const goToSubscription = () => {
    setOpen(false);
    // ⚠️ Adapte cette route à ta vraie page d'abonnement/plans.
    navigate("/premium");
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            onClick={() => setOpen(true)}
            className="fixed bottom-15 lg:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center"
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
            className="fixed bottom-20 lg:bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)]
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
                <div className="flex flex-col items-center text-center px-2 py-4">
                  <Avatar />
                  <p className="text-sm text-slate-400 mt-4 mb-5 leading-relaxed">
                    {t(
                      "ai_chat.empty_state",
                      "Ask me anything about your course — or try one of these:"
                    )}
                  </p>

                  <div className="flex flex-col gap-2 w-full">
                    {quickQA.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(qa)}
                        className="text-left text-xs text-slate-300 bg-[#232529] border border-slate-800
                                   hover:border-indigo-500/60 hover:text-white rounded-xl px-3.5 py-2.5 transition"
                      >
                        {qa.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
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

                  {msg.needsSubscription && (
                    <div className="flex justify-start mt-2 ml-[42px]">
                      <button
                        onClick={goToSubscription}
                        className="text-xs font-semibold text-white bg-gradient-to-br from-indigo-600 to-purple-600
                                   rounded-lg px-3.5 py-2 shadow-md hover:opacity-90 transition"
                      >
                        {t("ai_chat.subscribe_cta", "See subscription plans")}
                      </button>
                    </div>
                  )}
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