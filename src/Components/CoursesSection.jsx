import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, BookOpen, GraduationCap, X, Sparkles,
  Send, ChevronRight, ChevronDown, RotateCcw, Copy, Check, Clock, Globe2,
} from "lucide-react";
import api from "../services/api"; // adapte le chemin si besoin

/* ─────────────────────────────────────────────────────────────
   INJECT STYLES
───────────────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("courses-light-styles")) return;
  const s = document.createElement("style");
  s.id = "courses-light-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700;800&display=swap');
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
    .csl-pulse { animation: pulseRing 1.8s ease-out infinite; }
    @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.45)} 100%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }
    .csl-shimmer {
      background: linear-gradient(110deg, #EEF2FF 8%, #F5F3FF 18%, #EEF2FF 33%);
      background-size: 200% 100%;
      animation: shimmer 2.2s linear infinite;
    }
    @keyframes shimmer { to { background-position-x: -200%; } }
    .csl-mesh {
      background:
        radial-gradient(600px circle at 0% 0%, rgba(99,102,241,0.08), transparent 45%),
        radial-gradient(500px circle at 100% 0%, rgba(168,85,247,0.06), transparent 45%);
    }
  `;
  document.head.appendChild(s);
};

/* ─────────────────────────────────────────────────────────────
   REAL AI CALL — via ton backend (qui gère la clé Anthropic + le quota)
───────────────────────────────────────────────────────────── */
async function callAI(question, course, language) {
  const data = await api("/ai/chat", {
    method: "POST",
    data: {
      message: question,
      context: {
        courseTitle: course.title,
        program: course.program,
        school: course.school,
        language,
      },
    },
  });
  return data.reply;
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
   COURSE INFO CONTENT (partagé desktop/mobile)
───────────────────────────────────────────────────────────── */
function CourseInfoContent({ course, t }) {
  const facts = [
    { icon: GraduationCap, label: t("courses.modal.institution", "Institution"), value: course.school },
    { icon: BookOpen,      label: t("courses.modal.level", "Level"),             value: t("courses.modal.levelValue", "Bachelor / Master") },
    { icon: Clock,         label: t("courses.modal.duration", "Duration"),       value: t("courses.modal.durationValue", "12 – 24 months") },
    { icon: Globe2,        label: t("courses.modal.format", "Format"),           value: t("courses.modal.formatValue", "100% Online") },
  ];

  return (
    <>
      <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-indigo-500 mb-3">
        {t("courses.modal.about", "About")}
      </p>
      <p className="text-[#4B5563] text-[13.5px] leading-relaxed mb-6">
        {t("courses.modal.description", { program: course.program, school: course.school })}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 md:gap-2.5">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 md:gap-3 bg-[#F9FAFB] rounded-xl px-3 py-2.5 md:py-3 border border-black/[0.04]"
          >
            <div
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)" }}
            >
              <Icon size={13} className="text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#9CA3AF] leading-tight">{label}</p>
              <p className="text-[12.5px] md:text-sm font-semibold text-[#0F0F1A] truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   COURSE MODAL — centered card on desktop, full sheet on mobile
───────────────────────────────────────────────────────────── */
function CourseModal({ course, onClose }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro");
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
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

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const startChat = () => {
    setPhase("chat");
    setMobileInfoOpen(false);
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
    } catch (err) {
      const needsSubscription = err?.status === 402;
      const text = needsSubscription
        ? (lang === "fr"
            ? "Tu as atteint ta limite de questions gratuites ce mois-ci."
            : "You've reached your free question limit for this month.")
        : (lang === "fr"
            ? "Désolé, une erreur s'est produite. Veuillez réessayer."
            : "Sorry, an error occurred. Please try again.");

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: "ai",
        text,
        isError: true,
        needsSubscription,
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

  const goToSubscription = () => {
    onClose();
    navigate("/premium"); // adapte à ta vraie route
  };

  const renderText = (text) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );

  return (
    <motion.div
      className="csl-sans fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-[#0F0F1A]/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="csl-mesh relative w-full sm:max-w-[960px] h-[94vh] sm:h-[86vh] max-h-[860px] bg-[#F7F6F3] sm:rounded-[28px] rounded-t-[28px] border border-black/[0.06] shadow-[0_40px_100px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-0 shrink-0 relative z-20">
          <div className="w-10 h-1 rounded-full bg-black/15" />
        </div>

        {/* ── HERO BAND ── */}
        <div className="relative h-[150px] sm:h-[190px] shrink-0 overflow-hidden">
          <img
            src={`${course.image}?auto=format&w=1400&q=80`}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(15,15,26,0.1) 0%, rgba(15,15,26,0.35) 55%, rgba(15,15,26,0.88) 100%)" }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/50 active:scale-95 transition-all z-10"
            aria-label={t("courses.modal.close", "Close")}
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-4 sm:pb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] uppercase text-indigo-300 mb-1.5">
              <span className="w-4 h-[1.5px] bg-indigo-300/70" />
              {course.program}
            </span>
            <h2 className="csl-serif text-white text-[19px] sm:text-[26px] font-bold leading-[1.15] mb-1 max-w-[560px]">
              {course.title}
            </h2>
            <div className="flex items-center gap-2 text-white/75 text-[11.5px] sm:text-[12.5px]">
              <GraduationCap size={12} />
              <span>{course.school}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <BookOpen size={11} />
              <span>{t("courses.modal.online", "Online")}</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE INFO ACCORDION ── */}
        <div className="md:hidden shrink-0 border-b border-black/[0.06] bg-white">
          <button
            onClick={() => setMobileInfoOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3"
          >
            <span className="text-[12.5px] font-bold text-[#0F0F1A]">
              {t("courses.modal.about", "About")} {t("courses.modal.thisProgram", "this program")}
            </span>
            <motion.span animate={{ rotate: mobileInfoOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-[#9CA3AF]" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {mobileInfoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  <CourseInfoContent course={course} t={t} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative z-10">

          {/* LEFT — course info (desktop only) */}
          <div className="hidden md:flex flex-col w-[290px] lg:w-[310px] shrink-0 border-r border-black/[0.06] bg-white/70 backdrop-blur-sm overflow-y-auto no-scrollbar p-6 lg:p-7">
            <CourseInfoContent course={course} t={t} />

            <button
              onClick={startChat}
              className="w-full mt-6 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <Sparkles size={14} /> {t("courses.modal.exploreWithAI", "Explore with AI")}
            </button>

            <div className="mt-auto pt-6 hidden lg:block">
              <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF]">
                <Check size={12} className="text-green-500" />
                {t("courses.modal.certAvailable", "Certificate available")}
              </div>
            </div>
          </div>

          {/* RIGHT — intro OR chat */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ── INTRO PHASE ── */}
              {phase === "intro" && (
                <motion.div
                  key="intro"
                  className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto no-scrollbar"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="w-full max-w-[480px]">
                    <div className="bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-7 shadow-[0_8px_40px_rgba(0,0,0,0.06)] mb-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                        >
                          <Sparkles size={16} color="#fff" />
                        </div>
                        <div>
                          <p className="text-[#0F0F1A] font-bold text-[13.5px]">
                            {t("courses.modal.learnWithAI", "Learn with AI")}
                          </p>
                          <p className="text-[#9CA3AF] text-[11.5px] flex items-center gap-1.5">
                            <span className="w-[6px] h-[6px] rounded-full bg-green-500 csl-pulse" />
                            {t("courses.modal.aiSubtitle", "Avila AI · Answers instantly")}
                          </p>
                        </div>
                      </div>

                      <p className="text-[#374151] text-[13px] sm:text-[13.5px] leading-relaxed mb-5">
                        {t("courses.modal.aiIntro", "I can help you explore this course, answer questions about career paths, prerequisites, enrollment, and much more.")}
                      </p>

                      <button
                        onClick={startChat}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-[0.98] transition-all"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                      >
                        <Sparkles size={14} /> {t("courses.modal.startWithAI", "Start with AI")}
                      </button>
                    </div>

                    <p className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5 pl-1">
                      {t("courses.modal.popularQuestions", "Popular questions")}
                    </p>
                    <div className="flex flex-col gap-2">
                      {topics.slice(0, 4).map((topic) => (
                        <button
                          key={topic}
                          onClick={() => { startChat(); setTimeout(() => askAI(topic), 300); }}
                          className="w-full text-left text-[12.5px] text-[#374151] bg-white border border-black/[0.06] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] transition-all group"
                        >
                          <span>{topic}</span>
                          <ChevronRight size={13} className="text-[#D1D5DB] group-hover:text-indigo-400 group-hover:translate-x-0.5 shrink-0 transition-all" />
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
                  className="flex-1 min-h-0 flex flex-col overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                    >
                      <Sparkles size={13} color="#fff" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#0F0F1A] font-bold text-[13px]">Avila AI</p>
                      <p className="text-[#9CA3AF] text-[11px] flex items-center gap-1.5">
                        <span
                          className={`inline-block w-[6px] h-[6px] rounded-full ${!loading ? "csl-pulse" : ""}`}
                          style={{ background: loading ? "#a78bfa" : "#22c55e" }}
                        />
                        {loading
                          ? t("courses.modal.thinking", "Thinking…")
                          : t("courses.modal.online", "Online")}
                      </p>
                    </div>
                    <button
                      onClick={() => setPhase("intro")}
                      className="ml-auto shrink-0 text-[11px] font-medium text-[#6B7280] hover:text-[#6366f1] flex items-center gap-1 transition-colors px-2 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      <RotateCcw size={11} />
                      <span className="hidden sm:inline">{t("courses.modal.newTopic", "New topic")}</span>
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3.5 sm:px-5 py-4 sm:py-5 flex flex-col gap-3.5 sm:gap-4 bg-transparent">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`csl-bubble-in flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div className={`flex items-end gap-2 w-full ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          {msg.sender === "ai" && (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                            >
                              <Sparkles size={11} color="#fff" />
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 text-[13px] sm:text-[13.5px] leading-relaxed rounded-2xl ${
                              msg.sender === "user"
                                ? "text-white rounded-br-[4px]"
                                : msg.isError
                                ? "bg-red-500/10 border border-red-500/30 text-red-600 rounded-bl-[4px]"
                                : "bg-white border border-black/[0.06] text-[#1A1A2E] rounded-bl-[4px] shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
                            }`}
                            style={msg.sender === "user" ? { background: "linear-gradient(135deg,#4f46e5,#7c3aed)" } : {}}
                          >
                            <span className="whitespace-pre-wrap">{renderText(msg.text)}</span>
                          </div>
                        </div>

                        {msg.needsSubscription && (
                          <div className="pl-9 mt-1">
                            <button
                              onClick={goToSubscription}
                              className="text-[12px] font-bold text-white rounded-lg px-3.5 py-2 shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                            >
                              {t("courses.modal.subscribeCta", "See subscription plans")}
                            </button>
                          </div>
                        )}

                        {msg.sender === "ai" && msg.id !== "welcome" && !msg.isError && (
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
                              className="text-[11.5px] sm:text-[12px] text-[#374151] bg-white border border-black/[0.06] rounded-full px-3.5 py-1.5 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-pointer font-[inherit] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
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
                  <div className="shrink-0 px-3.5 sm:px-5 py-3 border-t border-black/[0.06] bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-end gap-2 border border-black/[0.08] rounded-[18px] px-3.5 sm:px-4 py-2.5 transition-colors focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-100 bg-[#F9FAFB]">
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
                        className="flex-1 resize-none outline-none border-none bg-transparent text-[13px] sm:text-[13.5px] leading-[1.5] font-[inherit] text-[#1A1A2E] placeholder:text-[#9CA3AF] max-h-[120px] overflow-y-auto disabled:opacity-50"
                        style={{ scrollbarWidth: "none" }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => askAI(input)}
                        disabled={!input.trim() || loading}
                        className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:opacity-90 transition-opacity"
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

        {/* Mobile CTA (intro only) */}
        {phase === "intro" && (
          <div className="md:hidden shrink-0 px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-3 border-t border-black/[0.06] bg-white relative z-10">
            <button
              onClick={startChat}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <Sparkles size={14} /> {t("courses.modal.startWithAI", "Start with AI")}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────────────────────────── */
function CourseCard({ course, index, ctaLabel, t, onClick }) {
  return (
    <motion.div
      className="csl-card bg-white rounded-2xl overflow-hidden border border-black/[0.06] flex flex-col cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      whileHover={{ y: -5, boxShadow: "0 20px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden shrink-0">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          src={`${course.image}?auto=format&w=600&q=80`}
          alt={course.title}
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.28) 100%)" }}
        />
        <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md border border-black/[0.07] px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold text-[#1A1A2E] tracking-[0.03em]">
          {course.school}
        </span>
        <div
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
          style={{ background: "#6366F1" }}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="px-4 sm:px-[18px] pt-4 sm:pt-[18px] pb-3 flex-1 flex flex-col">
        <p className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.12em] uppercase text-indigo-500 mb-1.5">
          {course.program}
        </p>
        <h3 className="csl-serif text-[14.5px] sm:text-[15.5px] font-bold text-[#0F0F1A] leading-snug mb-auto">
          {course.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-3.5 text-[11.5px] sm:text-[12px] text-[#9CA3AF]">
          <GraduationCap size={12} />
          <span className="truncate">{course.school}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#D1D5DB] shrink-0" />
          <BookOpen size={11} />
          <span className="shrink-0">{t("courses.modal.online", "Online")}</span>
        </div>
      </div>

      <button
        className="mx-4 sm:mx-[18px] mb-4 sm:mb-[18px] mt-3 py-[11px] rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] text-[12.5px] sm:text-[13px] font-semibold font-[inherit] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white"
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
        style={{ background: "#F7F6F3", color: "#1A1A2E", padding: "56px 20px 64px" }}
      >
        <style>{`
          @media (min-width: 768px) {
            .csl-section-pad { padding: 88px 24px 100px !important; }
          }
        `}</style>

        <div style={{ maxWidth: 1180, margin: "0 auto" }}>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-7 sm:mb-9">
            <div>
              <p className="flex items-center gap-2 text-[10.5px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-indigo-500 mb-2.5 sm:mb-3">
                <span className="inline-block w-5 h-[1.5px] bg-indigo-500" />
                {t("courses.catalogue", "Catalogue")}
              </p>
              <h2 className="csl-serif text-[28px] sm:text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0F0F1A] m-0">
                {t("courses.headingPrefix", "Our")}{" "}
                <em className="italic text-indigo-500">{t("courses.headingHighlight", "programs")}</em>
              </h2>
              <p className="text-[13.5px] sm:text-[15px] text-[#6B7280] leading-[1.65] mt-2.5 sm:mt-3 max-w-[420px]">
                {t("courses.subtitle", "Recognized programs, accessible online, to advance your career.")}
              </p>
            </div>
            <span className="text-[12.5px] sm:text-[13px] text-[#9CA3AF] font-medium sm:self-end whitespace-nowrap">
              {t("courses.courseCount", { count: active.length })}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-[2px] bg-[#EDECE8] rounded-xl p-1 w-max flex-nowrap mb-7 sm:mb-9 overflow-x-auto no-scrollbar max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-[18px] py-2 sm:py-[9px] rounded-[9px] border-none text-[12.5px] sm:text-[13px] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 ${
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
              className="grid gap-3.5 sm:gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
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