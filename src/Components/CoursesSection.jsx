import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, BookOpen, GraduationCap, X, Sparkles,
  Send, ChevronRight, ChevronDown, RotateCcw, Copy, Check, Clock, Globe2, Award,
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800&display=swap');
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
    .csl-float { animation: floaty 6s ease-in-out infinite; }
    @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .csl-grain::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
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
   COURSE MODAL — FULL SCREEN, XXL DESIGN
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
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";

  const topics = [
    t("courses.modal.topic1", { title: course.title }),
    t("courses.modal.topic2"),
    t("courses.modal.topic3", { school: course.school }),
    t("courses.modal.topic4"),
    t("courses.modal.topic5", { school: course.school }),
    t("courses.modal.topic6"),
  ];

  const facts = [
    { icon: GraduationCap, label: t("courses.modal.institution", "Institution"), value: course.school },
    { icon: BookOpen,      label: t("courses.modal.level", "Level"),             value: t("courses.modal.levelValue", "Bachelor / Master") },
    { icon: Clock,         label: t("courses.modal.duration", "Duration"),       value: t("courses.modal.durationValue", "12 – 24 months") },
    { icon: Globe2,        label: t("courses.modal.format", "Format"),           value: t("courses.modal.formatValue", "100% Online") },
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

  const handleScroll = (e) => setScrolled(e.target.scrollTop > 20);

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
      className="csl-sans fixed inset-0 z-[9999] bg-[#0B0C10] flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── FLOATING TOP BAR ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-5 sm:pt-6 transition-all duration-300"
        style={{
          background: scrolled ? "linear-gradient(to bottom, rgba(11,12,16,0.85), transparent)" : "transparent",
          paddingBottom: scrolled ? "20px" : "0px",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-3.5 h-[1.5px] bg-indigo-300" />
            {course.program}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all"
          aria-label={t("courses.modal.close", "Close")}
        >
          <X size={18} />
        </button>
      </motion.div>

      {/* ── SCROLLABLE BODY ── */}
      <div
        ref={bodyRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
      >
        {/* ── XXL HERO ── */}
        <div className="relative h-[46vh] sm:h-[52vh] lg:h-[58vh] min-h-[340px] w-full overflow-hidden csl-grain">
          <motion.img
            src={`${course.image}?auto=format&w=1800&q=85`}
            alt={course.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(11,12,16,0.15) 0%, rgba(11,12,16,0.25) 40%, rgba(11,12,16,0.75) 78%, #0B0C10 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 900px 500px at 15% 100%, rgba(99,102,241,0.35), transparent 70%)" }}
          />

          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-12 pb-8 sm:pb-10 lg:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2 text-white/60 text-[11px] sm:text-[12px] font-semibold tracking-[0.1em] uppercase mb-3 sm:mb-4">
                <GraduationCap size={13} />
                <span>{course.school}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <BookOpen size={12} />
                <span>{t("courses.modal.online", "Online")}</span>
              </div>
              <h2 className="csl-serif text-white text-[34px] sm:text-[48px] lg:text-[64px] font-black leading-[0.98] tracking-[-0.02em] max-w-[900px]">
                {course.title}
              </h2>
            </motion.div>
          </div>
        </div>

        {/* ── MOBILE INFO ACCORDION ── */}
        <div className="lg:hidden border-b border-white/[0.06] bg-[#0B0C10]">
          <button
            onClick={() => setMobileInfoOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 sm:px-8 py-4"
          >
            <span className="text-[12.5px] font-bold text-white/90 tracking-wide uppercase">
              {t("courses.modal.about", "About")} {t("courses.modal.thisProgram", "this program")}
            </span>
            <motion.span animate={{ rotate: mobileInfoOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={17} className="text-white/40" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {mobileInfoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-8 pb-6">
                  <p className="text-white/50 text-[13.5px] leading-relaxed mb-5">
                    {t("courses.modal.description", { program: course.program, school: course.school })}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {facts.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-indigo-500/15">
                          <Icon size={13} className="text-indigo-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9.5px] text-white/35 leading-tight">{label}</p>
                          <p className="text-[12px] font-semibold text-white truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-14">

          {/* LEFT — sticky sidebar (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-indigo-400 mb-3">
                  {t("courses.modal.about", "About this program")}
                </p>
                <p className="text-white/55 text-[15px] leading-relaxed">
                  {t("courses.modal.description", { program: course.program, school: course.school })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/15">
                      <Icon size={16} className="text-indigo-300" />
                    </div>
                    <p className="text-[10px] text-white/35 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-[13.5px] font-bold text-white leading-snug">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5 text-white/40 text-[12px] pt-1">
                <Award size={14} className="text-amber-400/80" />
                {t("courses.modal.certAvailable", "Certificate of completion available")}
              </div>

              <button
                onClick={startChat}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                <Sparkles size={15} /> {t("courses.modal.exploreWithAI", "Explore with AI")}
              </button>
            </div>
          </div>

          {/* RIGHT — intro OR chat */}
          <div className="min-h-[70vh] lg:min-h-[75vh] flex flex-col">
            <AnimatePresence mode="wait">

              {/* ── INTRO PHASE ── */}
              {phase === "intro" && (
                <motion.div
                  key="intro"
                  className="flex-1 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full max-w-[640px]">
                    <div
                      className="relative rounded-3xl p-7 sm:p-10 mb-7 overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.08))",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="csl-float absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />

                      <div className="relative flex items-center gap-4 mb-6">
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                        >
                          <Sparkles size={20} color="#fff" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-[17px] sm:text-[19px]">
                            {t("courses.modal.learnWithAI", "Learn with AI")}
                          </p>
                          <p className="text-white/45 text-[12.5px] sm:text-[13px] flex items-center gap-1.5">
                            <span className="w-[6px] h-[6px] rounded-full bg-green-400 csl-pulse" />
                            {t("courses.modal.aiSubtitle", "Avila AI · Answers instantly")}
                          </p>
                        </div>
                      </div>

                      <p className="relative text-white/65 text-[14.5px] sm:text-[15.5px] leading-relaxed mb-7 max-w-[480px]">
                        {t("courses.modal.aiIntro", "I can help you explore this course, answer questions about career paths, prerequisites, enrollment, and much more.")}
                      </p>

                      <button
                        onClick={startChat}
                        className="relative w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:opacity-90 active:scale-[0.98] transition-all"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                      >
                        <Sparkles size={15} /> {t("courses.modal.startWithAI", "Start with AI")}
                      </button>
                    </div>

                    <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/35 mb-3.5 pl-1">
                      {t("courses.modal.popularQuestions", "Popular questions")}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => { startChat(); setTimeout(() => askAI(topic), 300); }}
                          className="text-left text-[13px] text-white/70 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 hover:border-indigo-400/40 hover:bg-white/[0.07] hover:text-white transition-all group"
                        >
                          <span className="leading-snug">{topic}</span>
                          <ChevronRight size={14} className="text-white/25 group-hover:text-indigo-300 group-hover:translate-x-0.5 shrink-0 transition-all" />
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
                  className="flex-1 flex flex-col rounded-3xl overflow-hidden border border-white/[0.07]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)" }}
                    >
                      <Sparkles size={14} color="#fff" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-[13.5px]">Avila AI</p>
                      <p className="text-white/40 text-[11px] flex items-center gap-1.5">
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
                      className="ml-auto shrink-0 text-[11.5px] font-medium text-white/45 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]"
                    >
                      <RotateCcw size={12} />
                      <span className="hidden sm:inline">{t("courses.modal.newTopic", "New topic")}</span>
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-6 flex flex-col gap-4 min-h-[400px]">
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
                            className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 text-[13.5px] leading-relaxed rounded-2xl ${
                              msg.sender === "user"
                                ? "text-white rounded-br-[4px]"
                                : msg.isError
                                ? "bg-red-500/10 border border-red-500/25 text-red-300 rounded-bl-[4px]"
                                : "bg-white/[0.05] border border-white/[0.08] text-white/85 rounded-bl-[4px]"
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
                              className="text-[12px] font-bold text-white rounded-xl px-4 py-2.5 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
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
                                copiedId === msg.id ? "text-indigo-300" : "text-white/30 hover:text-white/55"
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
                        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-[4px]">
                          <ThinkingDots />
                        </div>
                      </div>
                    )}

                    {messages.length === 1 && !loading && (
                      <div className="csl-bubble-in flex flex-col gap-2 pl-9">
                        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/30">
                          {t("courses.modal.suggestedTopics", "Suggested topics")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {topics.map((topic) => (
                            <button
                              key={topic}
                              onClick={() => askAI(topic)}
                              className="text-[12px] text-white/65 bg-white/[0.05] border border-white/[0.08] rounded-full px-3.5 py-1.5 hover:border-indigo-400/40 hover:text-white transition-all cursor-pointer font-[inherit]"
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
                  <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-end gap-2 border border-white/[0.1] rounded-2xl px-4 py-3 transition-colors focus-within:border-indigo-400/50 bg-white/[0.03]">
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
                        className="flex-1 resize-none outline-none border-none bg-transparent text-[13.5px] leading-[1.5] font-[inherit] text-white placeholder:text-white/30 max-h-[120px] overflow-y-auto disabled:opacity-50"
                        style={{ scrollbarWidth: "none" }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => askAI(input)}
                        disabled={!input.trim() || loading}
                        className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:opacity-90 transition-opacity"
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
      </div>

      {/* Mobile CTA (intro only, fixed bottom) */}
      {phase === "intro" && (
        <div className="lg:hidden shrink-0 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-3 border-t border-white/[0.06] bg-[#0B0C10]/95 backdrop-blur-md">
          <button
            onClick={startChat}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:opacity-90 active:scale-[0.98] transition-all"
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