import React, { useState, useRef, useEffect } from "react";
import { X, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { askAIMock } from "./ai/mockAI";
import { useTranslation } from "react-i18next";

export default function ChatBot({ onClose }) {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: t("chatbot.welcome")
    }
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (q) => {
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setInput("");
    setLoading(true);

    const reply = await askAIMock(q);

    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[5px]">

        <motion.div className="w-full max-w-md h-[80vh] flex flex-col overflow-y-auto rounded-[28px] bg-neutral-900/90 border border-white/10">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-800 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-white font-semibold text-sm">
                  Avila AI
                </span>
                <span className="text-white/40 text-xs">
                  {t("chatbot.subtitle")}
                </span>
              </div>

            </div>

            <button onClick={onClose}>
              <X className="w-5 h-5 text-white/50 hover:text-white" />
            </button>

          </div>

          {/* CHAT */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>

                <motion.div
                  className={`max-w-[75%] px-4 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full"
                      : "bg-white/10 text-white rounded-2xl"
                  }`}
                >
                  {msg.text}
                </motion.div>

              </div>
            ))}

            <div ref={scrollRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-white/5 flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
              placeholder={t("chatbot.placeholder")}
              className="flex-1 bg-white/10 text-white px-3 py-2 rounded-full outline-none"
            />

            <button
              onClick={() => handleAsk(input)}
              className="p-2 rounded-full bg-linear-to-r from-pink-500 to-purple-600"
            >
              <Send className="w-4 h-4 text-white" />
            </button>

          </div>

        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}