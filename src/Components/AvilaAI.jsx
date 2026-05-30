import React, { useState } from "react";
import { X, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { askAI } from "../services/askAI";


function AvilaAI() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState(
    "What can I help you with ?"
  );
  const [answer, setAnswer] = useState("");

  const handleAsk = async (q) => {
    setQuestion(q);
    setAnswer("⏳ Avila is thinking...");

    const reply = await askAI(q);

    setAnswer(reply);
  };


  return (
    <>
    

      {/* ===== META AI MODAL ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="inset-0 z-50 flex items-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="lg:w-full w-98 bg-white rounded-2xl shadow-xl p-5"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center font-extrabold  gap-2 text-slate-600">
                  <span className="w-3 h-3  rounded-full bg-rose-400" />
                  Avila
                </div>
              </div>

              {/* QUESTION */}
              <h2 className="text-gray-900 font-medium mb-5">{question}</h2>

              {/* ANSWER / SKELETON */}
              {!answer ? (
                <div className="space-y-2 mb-5">
                  <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-full w-5/6 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-full w-4/6 animate-pulse" />
                </div>
              ) : (
                <p className="text-sm text-gray-700 my-10">{answer}</p>
              )}

              {/* SUGGESTIONS */}
              <div className="flex flex-wrap  gap-2 mb-5">
                {[
                    "What is this platform?",
                    "How do the courses work?",
                    "Why learn programming?",
                    "What is the price of the courses?",
                    ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(s)}
                    className="px-3 py-1.5 text-sm cursor-pointer text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <div className="border border-neutral-200 text-slate-800 bg-neutral-100 rounded-xl px-3 py-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      handleAsk(input);
                      setInput("");
                    }
                  }}
                  placeholder="What can I help you with ?..."
                  className="w-full outline-none text-slate-800 text-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AvilaAI;
