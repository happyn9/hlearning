import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, BookOpen, GraduationCap, X, Sparkles,
  Send, ChevronRight, RotateCcw, Copy, Check,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   INJECT STYLES
───────────────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("courses-light-styles")) return;
  const s = document.createElement("style");
  s.id = "courses-light-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap');
    .csl-serif { font-family: 'Playfair Display', Georgia, serif; }
    .csl-sans  { font-family: 'Inter', system-ui, sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { scrollbar-width: none; }
    .csl-bubble-in { animation: bubbleIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes bubbleIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:none; } }
    .csl-dot { animation: dotBounce 0.85s ease-in-out infinite; }
    .csl-dot:nth-child(2) { animation-delay: 0.18s; }
    .csl-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes dotBounce { 0%,100%{transform:translateY(0);opacity:.35} 50%{transform:translateY(-4px);opacity:1} }
  `;
  document.head.appendChild(s);
};

/* ─────────────────────────────────────────────────────────────
   REAL AI CALL — Anthropic API
───────────────────────────────────────────────────────────── */
async function callAI(question, course, language) {
  const langInstruction = language === "fr"
    ? "Réponds toujours en français."
    : "Always reply in English.";

  const systemPrompt = `You are Avila AI, an educational assistant for the h-Learning platform. 
You help students learn about courses and programs.
The student is asking about the course: "${course.title}" (${course.program}) at ${course.school}.
${langInstruction}
Be concise, helpful, and encouraging. Max 3 short paragraphs.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, I could not get a response.";
}

/* ─────────────────────────────────────────────────────────────
   THINKING DOTS
───────────────────────────────────────────────────────────── */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-[5px] px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="csl-dot block w-[5px] h-[5px] rounded-full"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COURSE MODAL
───────────────────────────────────────────────────────────── */
function CourseModal({ course, onClose }) {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState("intro");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";

  const topics = [
    t("courses.modal.topic1", { title: course.title }),
    t("courses.modal.topic2"),
    t("courses.modal.topic3", { school: course.school }),
    t("courses.modal.topic4"),
    t("courses.modal.topic5", { school: course.school }),
    t("courses.modal.topic6"),
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startChat = () => {
    setPhase("chat");
    setMessages([{
      id: "welcome",
      sender: "ai",
      text: t("courses.modal.welcomeMessage", { title: course.title }),
    }]);
  };

  const askAI = useCallback(async (q) => {
    if (!q.trim() || loading) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await callAI(q, course, lang);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: "ai",
        text: lang === "fr"
          ? "Désolé, une erreur s'est produite. Veuillez réessayer."
          : "Sorry, an error occurred. Please try again.",
      }]);
    }
    setLoading(false);
  }, [loading, course, lang]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askAI(input); }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const renderText = (text) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );

  return (
    <motion.div
      className="csl-sans fixed inset-0 z-9999 flex flex-col"
      style={{ background: "#F7F6F3" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* ── HERO BAND ── */}
      <div className="relative h-70 md:h-75 shrink-0 overflow-hidden">
        <img
          src={`${course.image}?auto=format&w=1400&q=80`}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.62) 100%)" }} />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
          aria-label={t("courses.modal.close", "Close")}
        >
          <X size={18} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
          <span className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-indigo-300 mb-2">
            {course.program}
          </span>
          <h2 className="csl-serif text-white text-3xl md:text-4xl font-bold leading-tight mb-1">
            {course.title}
          </h2>
          <div className="flex items-center gap-2 text-white/70 text-sm mt-2">
            <GraduationCap size={14} />
            <span>{course.school}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <BookOpen size={13} />
            <span>{t("courses.modal.online", "Online")}</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 absolute top-10 left-0 w-full overflow-hidden flex flex-col md:flex-row">

        {/* LEFT — course info */}
        <div className="hidden md:flex flex-col w-[320px] shrink-0 border-r border-black/[0.06] bg-white overflow-y-auto no-scrollbar p-8">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-indigo-500 mb-4">
            {t("courses.modal.about", "About")}
          </p>
          <p className="text-[#374151] text-sm leading-relaxed mb-6">
            {t("courses.modal.description", { program: course.program, school: course.school })}
          </p>

          <div className="space-y-3 mb-8">
            {[
              { label: t("courses.modal.institution", "Institution"), value: course.school },
              { label: t("courses.modal.level", "Level"),             value: t("courses.modal.levelValue", "Bachelor / Master") },
              { label: t("courses.modal.duration", "Duration"),       value: t("courses.modal.durationValue", "12 – 24 months") },
              { label: t("courses.modal.format", "Format"),           value: t("courses.modal.formatValue", "100% Online") },
              { label: t("courses.modal.language", "Language"),       value: t("courses.modal.languageValue", "French / English") },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-black/5 pb-3">
                <span className="text-[#9CA3AF]">{label}</span>
                <span className="text-[#0F0F1A] font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={startChat}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Sparkles size={14} /> {t("courses.modal.exploreWithAI", "Explore with AI")}
          </button>
        </div>

        {/* RIGHT — intro OR chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── INTRO PHASE ── */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto no-scrollbar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-full max-w-[520px]">
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.07)] mb-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                      >
                        <Sparkles size={16} color="#fff" />
                      </div>
                      <div>
                        <p className="text-[#0F0F1A] font-bold text-[14px]">
                          {t("courses.modal.learnWithAI", "Learn with AI")}
                        </p>
                        <p className="text-[#9CA3AF] text-[12px]">
                          {t("courses.modal.aiSubtitle", "Avila AI · Answers instantly")}
                        </p>
                      </div>
                    </div>

                    <p className="text-[#374151] text-[14px] leading-relaxed mb-6">
                      {t("courses.modal.aiIntro", "I can help you explore this course, answer questions about career paths, prerequisites, enrollment, and much more.")}
                    </p>

                    <button
                      onClick={startChat}
                      className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                    >
                      <Sparkles size={14} /> {t("courses.modal.startWithAI", "Start with AI")}
                    </button>
                  </div>

                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-3 pl-1">
                    {t("courses.modal.popularQuestions", "Popular questions")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {topics.slice(0, 4).map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { startChat(); setTimeout(() => askAI(topic), 300); }}
                        className="w-full text-left text-[13px] text-[#374151] bg-white border border-black/[0.06] rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-indigo-300 hover:text-indigo-700 transition-all group shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                      >
                        <span>{topic}</span>
                        <ChevronRight size={14} className="text-[#D1D5DB] group-hover:text-indigo-400 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── CHAT PHASE ── */}
            {phase === "chat" && (
              <motion.div
                key="chat"
                className="flex-1 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-black/[0.06] bg-white shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                  >
                    <Sparkles size={13} color="#fff" />
                  </div>
                  <div>
                    <p className="text-[#0F0F1A] font-bold text-[13px]">Avila AI</p>
                    <p className="text-[#9CA3AF] text-[11px] flex items-center gap-1.5">
                      <span
                        className="inline-block w-[6px] h-[6px] rounded-full"
                        style={{ background: loading ? "#a78bfa" : "#22c55e" }}
                      />
                      {loading
                        ? t("courses.modal.thinking", "Thinking…")
                        : t("courses.modal.online", "Online")}
                    </p>
                  </div>
                  <button
                    onClick={() => setPhase("intro")}
                    className="ml-auto text-[11px] text-[#9CA3AF] hover:text-[#6366f1] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={11} /> {t("courses.modal.newTopic", "New topic")}
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-5 flex flex-col gap-4 bg-[#F7F6F3]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`csl-bubble-in flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {msg.sender === "ai" && (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                          >
                            <Sparkles size={11} color="#fff" />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] px-4 py-2.5 text-[13.5px] leading-relaxed rounded-2xl ${
                            msg.sender === "user"
                              ? "text-white rounded-br-[4px]"
                              : "bg-white border border-black/[0.06] text-[#1A1A2E] rounded-bl-[4px] shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
                          }`}
                          style={msg.sender === "user" ? { background: "linear-gradient(135deg,#4f46e5,#7c3aed)" } : {}}
                        >
                          <span className="whitespace-pre-wrap">{renderText(msg.text)}</span>
                        </div>
                      </div>

                      {msg.sender === "ai" && msg.id !== "welcome" && (
                        <div className="flex items-center gap-1 pl-9">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className={`flex items-center gap-1 text-[10.5px] px-2 py-[3px] rounded-md cursor-pointer transition-colors border-none bg-transparent ${
                              copiedId === msg.id ? "text-indigo-500" : "text-[#9CA3AF] hover:text-[#6B7280]"
                            }`}
                          >
                            {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                            {copiedId === msg.id
                              ? t("courses.modal.copied", "Copied!")
                              : t("courses.modal.copy", "Copy")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="csl-bubble-in flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                      >
                        <Sparkles size={11} color="#fff" />
                      </div>
                      <div className="bg-white border border-black/[0.06] rounded-2xl rounded-bl-[4px] shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
                        <ThinkingDots />
                      </div>
                    </div>
                  )}

                  {messages.length === 1 && !loading && (
                    <div className="csl-bubble-in flex flex-col gap-2 pl-9">
                      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">
                        {t("courses.modal.suggestedTopics", "Suggested topics")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => askAI(topic)}
                            className="text-[12px] text-[#374151] bg-white border border-black/[0.06] rounded-full px-3.5 py-1.5 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-pointer font-[inherit] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 px-4 md:px-6 py-3 border-t border-black/[0.06] bg-white">
                  <div className="flex items-end gap-2 border border-black/[0.08] rounded-[18px] px-4 py-2.5 transition-colors focus-within:border-indigo-400/50 bg-[#F9FAFB]">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value.slice(0, 800));
                        e.target.style.height = "auto";
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                      }}
                      onKeyDown={handleKey}
                      placeholder={t("courses.modal.inputPlaceholder", "Ask your question…")}
                      disabled={loading}
                      className="flex-1 resize-none outline-none border-none bg-transparent text-[13.5px] leading-[1.5] font-[inherit] text-[#1A1A2E] placeholder:text-[#9CA3AF] max-h-[120px] overflow-y-auto disabled:opacity-50"
                      style={{ scrollbarWidth: "none" }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => askAI(input)}
                      disabled={!input.trim() || loading}
                      className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                      aria-label={t("courses.modal.send", "Send")}
                    >
                      <Send size={13} color="#fff" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile CTA */}
      {phase === "intro" && (
        <div className="md:hidden shrink-0 px-4 pb-6 pt-3 border-t border-black/[0.06] bg-white">
          <button
            onClick={startChat}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Sparkles size={14} /> {t("courses.modal.startWithAI", "Start with AI")}
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────────────────────────── */
function CourseCard({ course, index, ctaLabel, t, onClick }) {
  return (
    <motion.div
      className="csl-card bg-white rounded-2xl overflow-hidden border border-black/6 flex flex-col cursor-pointer group"
      style={{ transition: "box-shadow 0.22s, transform 0.22s" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="relative h-43 overflow-hidden shrink-0">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          src={`${course.image}?auto=format&w=600&q=80`}
          alt={course.title}
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)" }} />
        <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md border border-black/[0.07] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1A1A2E] tracking-[0.04em]">
          {course.school}
        </span>
        <div
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
          style={{ background: "#6366F1" }}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="px-4.5 pt-4.5 pb-3 flex-1 flex flex-col">
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-indigo-500 mb-1.5">
          {course.program}
        </p>
        <h3 className="csl-serif text-[15.5px] font-bold text-[#0F0F1A] leading-snug mb-auto">
          {course.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-3.5 text-[12px] text-[#9CA3AF]">
          <GraduationCap size={12} />
          <span>{course.school}</span>
          <span className="w-0.75 h-0.75 rounded-full bg-[#D1D5DB]" />
          <BookOpen size={11} />
          <span>{t("courses.modal.online", "Online")}</span>
        </div>
      </div>

      <button
        className="mx-4.5 mb-4.5 mt-3 py-2.75 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] text-[13px] font-semibold font-[inherit] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white"
        tabIndex={-1}
      >
        {ctaLabel} <ArrowUpRight size={13} />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
export default function CoursesSection() {
  injectStyles();

  const [activeTab, setActiveTab] = useState("business");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { t } = useTranslation();

  const tabs = [
    { id: "software",         label: t("courses.tabs.software",         "Software / IT") },
    { id: "business",         label: t("courses.tabs.business",         "Business") },
    { id: "law",              label: t("courses.tabs.law",              "Law") },
    { id: "management",       label: t("courses.tabs.management",       "Management") },
    { id: "entrepreneurship", label: t("courses.tabs.entrepreneurship", "Entrepreneurship") },
  ];

  const coursesData = {
    software: [
      { title: t("courses.software.0.title"), program: t("courses.software.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.software.1.title"), program: t("courses.software.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.software.2.title"), program: t("courses.software.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.software.3.title"), program: t("courses.software.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
    ],
    business: [
      { title: t("courses.business.0.title"), program: t("courses.business.0.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" },
      { title: t("courses.business.1.title"), program: t("courses.business.1.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
      { title: t("courses.business.2.title"), program: t("courses.business.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
      { title: t("courses.business.3.title"), program: t("courses.business.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
    ],
    law: [
      { title: t("courses.law.0.title"), program: t("courses.law.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7" },
      { title: t("courses.law.1.title"), program: t("courses.law.1.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85" },
      { title: t("courses.law.2.title"), program: t("courses.law.2.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87" },
      { title: t("courses.law.3.title"), program: t("courses.law.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
    ],
    management: [
      { title: t("courses.management.0.title"), program: t("courses.management.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
      { title: t("courses.management.1.title"), program: t("courses.management.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
      { title: t("courses.management.2.title"), program: t("courses.management.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.management.3.title"), program: t("courses.management.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
    entrepreneurship: [
      { title: t("courses.entrepreneurship.0.title"), program: t("courses.entrepreneurship.0.program"), school: "UNZA",   image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.entrepreneurship.1.title"), program: t("courses.entrepreneurship.1.program"), school: "ZCAS",   image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.entrepreneurship.2.title"), program: t("courses.entrepreneurship.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" },
      { title: t("courses.entrepreneurship.3.title"), program: t("courses.entrepreneurship.3.program"), school: "NIPA",   image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
  };

  const active = coursesData[activeTab];
  const ctaLabel = t("courses.viewDetail", "View Details");

  return (
    <>
      <section
        className="csl-sans"
        style={{ background: "#F7F6F3", color: "#1A1A2E", padding: "88px 24px 100px" }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>

          {/* Header */}
          <div className="flex items-end justify-between gap-6 mb-9 flex-wrap">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-indigo-500 mb-3">
                <span className="inline-block w-5 h-[1.5px] bg-indigo-500" />
                {t("courses.catalogue", "Catalogue")}
              </p>
              <h2 className="csl-serif text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0F0F1A] m-0">
                {t("courses.headingPrefix", "Our")}{" "}
                <em className="italic text-indigo-500">{t("courses.headingHighlight", "programs")}</em>
              </h2>
              <p className="text-[15px] text-[#6B7280] leading-[1.65] mt-3 max-w-[420px]">
                {t("courses.subtitle", "Recognized programs, accessible online, to advance your career.")}
              </p>
            </div>
            <span className="text-[13px] text-[#9CA3AF] font-medium self-end whitespace-nowrap">
              {t("courses.courseCount", { count: active.length })}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-[2px] bg-[#EDECE8] rounded-xl p-1 w-fit flex-wrap mb-9 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-[18px] py-[9px] rounded-[9px] border-none text-[13px] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-white text-[#0F0F1A] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
                    : "bg-transparent text-[#6B7280] font-medium hover:text-[#1A1A2E]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {active.map((course, i) => (
                <CourseCard
                  key={i}
                  course={course}
                  index={i}
                  ctaLabel={ctaLabel}
                  t={t}
                  onClick={() => setSelectedCourse(course)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}