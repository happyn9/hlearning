import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, Mic, Sparkles, Copy, RotateCcw, ChevronDown,
  Moon, Sun, Monitor, Check, StopCircle,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { askAIMock } from "./ai/mockAI";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────────────────────────────────
   THEME SYSTEM — light / dark / system
   ───────────────────────────────────────────────────────────────────────── */

const THEME_KEY = "avila_theme";

function useTheme() {
  const [theme, setThemeRaw] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) ?? "system"; } catch { return "system"; }
  });

  const resolved = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  const setTheme = (t) => {
    setThemeRaw(t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  };

  /* listen to OS changes when mode === system */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => { if (theme === "system") setThemeRaw((p) => p); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, setTheme, resolved };
}

/* ─────────────────────────────────────────────────────────────────────────
   CSS-in-JS DESIGN TOKENS — derived from resolved theme
   ───────────────────────────────────────────────────────────────────────── */

const tokens = {
  dark: {
    bg: "#0d0d10",
    surface: "rgba(255,255,255,0.035)",
    surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.07)",
    borderFocus: "rgba(139,92,246,0.45)",
    text: "#f1f0f5",
    textMuted: "#71717a",
    textSub: "#a1a1aa",
    userBubble: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 55%,#a855f7 100%)",
    userText: "#ffffff",
    aiBubble: "rgba(255,255,255,0.045)",
    aiBorder: "rgba(255,255,255,0.07)",
    glowA: "rgba(99,102,241,0.12)",
    glowB: "rgba(168,85,247,0.09)",
    inputBg: "rgba(255,255,255,0.04)",
    scrollBg: "rgba(255,255,255,0.08)",
    shadowCard: "0 32px 80px -16px rgba(99,102,241,0.3)",
    shadowSend: "0 4px 18px -4px rgba(139,92,246,0.55)",
    pill: "rgba(255,255,255,0.06)",
    pillHover: "rgba(139,92,246,0.18)",
    pillBorder: "rgba(255,255,255,0.08)",
    pillBorderHover: "rgba(139,92,246,0.45)",
    online: "#34d399",
    typing: "#a78bfa",
  },
  light: {
    bg: "#fafafa",
    surface: "rgba(0,0,0,0.025)",
    surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)",
    borderFocus: "rgba(99,102,241,0.5)",
    text: "#111116",
    textMuted: "#6b7280",
    textSub: "#4b5563",
    userBubble: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#9333ea 100%)",
    userText: "#ffffff",
    aiBubble: "rgba(0,0,0,0.03)",
    aiBorder: "rgba(0,0,0,0.08)",
    glowA: "rgba(99,102,241,0.06)",
    glowB: "rgba(168,85,247,0.05)",
    inputBg: "rgba(0,0,0,0.03)",
    scrollBg: "rgba(0,0,0,0.06)",
    shadowCard: "0 32px 80px -16px rgba(99,102,241,0.15), 0 2px 20px rgba(0,0,0,0.08)",
    shadowSend: "0 4px 18px -4px rgba(99,102,241,0.4)",
    pill: "rgba(0,0,0,0.04)",
    pillHover: "rgba(99,102,241,0.1)",
    pillBorder: "rgba(0,0,0,0.08)",
    pillBorderHover: "rgba(99,102,241,0.4)",
    online: "#059669",
    typing: "#6d28d9",
  },
};

/* ─────────────────────────────────────────────────────────────────────────
   STREAMING TEXT
   ───────────────────────────────────────────────────────────────────────── */

function StreamingText({ text, onDone, shouldAnimate }) {
  const [shown, setShown] = useState(shouldAnimate ? "" : text);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimate || prefersReduced) { setShown(text); onDone?.(); return; }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, 10);
    return () => clearInterval(id);
  }, [text, shouldAnimate]);

  return <span>{shown}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────
   AI AVATAR
   ───────────────────────────────────────────────────────────────────────── */

function AIAvatar({ thinking, size = 32 }) {
  const prefersReduced = useReducedMotion();
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {thinking && !prefersReduced && (
        <motion.div
          style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
            filter: "blur(8px)",
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        style={{
          position: "relative", width: size, height: size, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(139,92,246,0.4)",
        }}
        animate={prefersReduced ? {} : { scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={size * 0.44} color="#fff" strokeWidth={2.3} />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   THINKING DOTS
   ───────────────────────────────────────────────────────────────────────── */

function ThinkingDots({ tk }) {
  const prefersReduced = useReducedMotion();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "12px 16px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            display: "block", width: 6, height: 6, borderRadius: "50%",
            background: `linear-gradient(135deg,#6366f1,#a855f7)`,
          }}
          animate={prefersReduced ? {} : { y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   THEME TOGGLE PILL
   ───────────────────────────────────────────────────────────────────────── */

function ThemeToggle({ theme, setTheme, tk }) {
  const options = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "system", icon: Monitor, label: "System" },
    { id: "dark", icon: Moon, label: "Dark" },
  ];
  return (
    <div
      style={{
        display: "flex", alignItems: "center",
        background: tk.pill,
        border: `1px solid ${tk.border}`,
        borderRadius: 20, padding: "2px 3px", gap: 1,
      }}
    >
      {options.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          title={id}
          style={{
            width: 26, height: 26, borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: theme === id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
            border: "none", cursor: "pointer",
            color: theme === id ? "#fff" : tk.textMuted,
            transition: "all 0.2s",
          }}
        >
          <Icon size={12} />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SUGGESTIONS
   ───────────────────────────────────────────────────────────────────────── */

const SUGGESTIONS = [
  "Explique ce concept simplement",
  "Donne-moi un exemple concret",
  "Résume en 3 points clés",
  "Quelles sont les meilleures pratiques ?",
];

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────── */

export default function ChatBot({ onClose }) {
  const { t } = useTranslation();
  const { theme, setTheme, resolved } = useTheme();
  const tk = tokens[resolved];

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000;

  const [messages, setMessages] = useState([
    { id: "welcome", sender: "ai", text: t("chatbot.welcome", "Bonjour ! Je suis Avila AI. Comment puis-je vous aider aujourd'hui ?"), streamed: true },
  ]);

  const scrollRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  /* auto scroll */
  useEffect(() => {
    if (!showScrollBtn) scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setInput(val);
    setCharCount(val.length);
  };

  const handleAsk = useCallback(async (q) => {
    if (!q.trim() || loading) return;
    const userMsg = { id: crypto.randomUUID(), sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setCharCount(0);
    setLoading(true);

    const reply = await askAIMock(q);
    const aiMsg = { id: crypto.randomUUID(), sender: "ai", text: reply, streamed: false };
    setMessages((prev) => [...prev, aiMsg]);
    setStreamingId(aiMsg.id);
    setLoading(false);
  }, [loading]);

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleRegenerate = async (text) => {
    if (loading) return;
    setLoading(true);
    const reply = await askAIMock(text);
    const aiMsg = { id: crypto.randomUUID(), sender: "ai", text: reply, streamed: false };
    setMessages((prev) => [...prev, aiMsg]);
    setStreamingId(aiMsg.id);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(input); }
  };

  /* ── STYLES (inline, fully token-driven) ── */
  const s = {
    overlay: {
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: resolved === "dark" ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.4)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      padding: 16,
    },
    card: {
      position: "relative", width: "100%", maxWidth: 440,
      height: "86vh", maxHeight: 480,
      display: "flex", flexDirection: "column",
      borderRadius: 28, overflow: "hidden",
      background: tk.bg,
      border: `1px solid ${tk.border}`,
      boxShadow: tk.shadowCard,
    },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px",
      borderBottom: `1px solid ${tk.border}`,
      background: tk.surface,
      backdropFilter: "blur(20px)",
      flexShrink: 0,
    },
    chat: {
      flex: 1, overflowY: "auto", padding: "18px 14px",
      display: "flex", flexDirection: "column", gap: 14,
      scrollbarWidth: "none",
    },
    inputRow: {
      padding: "10px 12px",
      borderTop: `1px solid ${tk.border}`,
      background: tk.surface,
      backdropFilter: "blur(20px)",
      flexShrink: 0,
    },
    inputWrap: {
      display: "flex", alignItems: "flex-end", gap: 8,
    },
    textarea: {
      flex: 1, resize: "none", outline: "none", border: `1.5px solid ${tk.border}`,
      borderRadius: 18, padding: "10px 14px",
      background: tk.inputBg,
      color: tk.text, fontSize: 14, lineHeight: 1.5,
      fontFamily: "inherit",
      transition: "border-color 0.2s",
      maxHeight: 120,
    },
    iconBtn: (active) => ({
      width: 36, height: 36, borderRadius: "50%", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, transition: "all 0.18s",
      background: active ? tk.surfaceHover : "transparent",
      color: active ? tk.text : tk.textMuted,
    }),
    sendBtn: {
      width: 38, height: 38, borderRadius: "50%", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
      background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%)",
      boxShadow: tk.shadowSend,
      transition: "filter 0.18s, opacity 0.18s",
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        style={s.overlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          style={s.card}
          initial={{ y: 28, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 28, scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
        >
          {/* Ambient glows */}
          <div style={{
            position: "absolute", top: -80, left: -40, width: 260, height: 260,
            background: tk.glowA, borderRadius: "50%", filter: "blur(60px)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: 40, right: -60, width: 220, height: 220,
            background: tk.glowB, borderRadius: "50%", filter: "blur(60px)",
            pointerEvents: "none",
          }} />

          {/* ─── HEADER ─── */}
          <div style={s.header}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AIAvatar thinking={loading} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                <span style={{ color: tk.text, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
                  Avila AI
                </span>
                <span style={{ color: tk.textMuted, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <motion.span
                    style={{
                      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                      background: loading ? tk.typing : tk.online,
                    }}
                    animate={loading ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  {loading ? "En train de réfléchir…" : t("chatbot.subtitle", "En ligne · Répond instantanément")}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ThemeToggle theme={theme} setTheme={setTheme} tk={tk} />
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: tk.textMuted, transition: "all 0.18s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = tk.surfaceHover; e.currentTarget.style.color = tk.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = tk.textMuted; }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* ─── MESSAGES ─── */}
          <div ref={chatRef} style={s.chat} onScroll={handleScroll}>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  gap: 4,
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end", gap: 8,
                }}>
                  {msg.sender === "ai" && <AIAvatar thinking={false} size={28} />}

                  <div
                    style={{
                      maxWidth: "76%", padding: "10px 14px",
                      fontSize: 14, lineHeight: 1.6,
                      borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: msg.sender === "user" ? tk.userBubble : tk.aiBubble,
                      color: msg.sender === "user" ? tk.userText : tk.text,
                      border: msg.sender === "ai" ? `1px solid ${tk.aiBorder}` : "none",
                      boxShadow: msg.sender === "user" ? tk.shadowSend : "none",
                    }}
                  >
                    {msg.sender === "ai" && msg.id === streamingId ? (
                      <StreamingText
                        text={msg.text}
                        shouldAnimate={!msg.streamed}
                        onDone={() => setStreamingId(null)}
                      />
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                    )}
                  </div>
                </div>

                {/* Action bar below AI messages */}
                {msg.sender === "ai" && msg.id !== streamingId && msg.id !== "welcome" && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 2, paddingLeft: 36,
                  }}>
                    {[
                      {
                        icon: copiedId === msg.id ? Check : Copy,
                        label: copiedId === msg.id ? "Copié !" : "Copier",
                        action: () => handleCopy(msg.id, msg.text),
                        active: copiedId === msg.id,
                      },
                      {
                        icon: RotateCcw,
                        label: "Régénérer",
                        action: () => handleRegenerate(messages[idx - 1]?.text ?? msg.text),
                      },
                    ].map(({ icon: Icon, label, action, active }) => (
                      <button
                        key={label}
                        onClick={action}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 10, color: active ? "#8b5cf6" : tk.textMuted,
                          background: "transparent", border: "none", cursor: "pointer",
                          padding: "3px 8px", borderRadius: 8,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = tk.surfaceHover;
                          e.currentTarget.style.color = tk.textSub;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = active ? "#8b5cf6" : tk.textMuted;
                        }}
                      >
                        <Icon size={10} />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <AIAvatar thinking size={28} />
                <div style={{
                  background: tk.aiBubble,
                  border: `1px solid ${tk.aiBorder}`,
                  borderRadius: "20px 20px 20px 4px",
                }}>
                  <ThinkingDots tk={tk} />
                </div>
              </motion.div>
            )}

            {/* Suggestions — visible only at start */}
            {messages.length === 1 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}
              >
                <span style={{
                  fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
                  color: tk.textMuted, fontWeight: 600, paddingLeft: 4,
                }}>
                  Suggestions
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => handleAsk(s)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        textAlign: "left", fontSize: 12.5, color: tk.textSub,
                        background: tk.pill,
                        border: `1px solid ${tk.pillBorder}`,
                        borderRadius: 14, padding: "10px 13px",
                        cursor: "pointer", lineHeight: 1.45,
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = tk.pillHover;
                        e.currentTarget.style.borderColor = tk.pillBorderHover;
                        e.currentTarget.style.color = tk.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = tk.pill;
                        e.currentTarget.style.borderColor = tk.pillBorder;
                        e.currentTarget.style.color = tk.textSub;
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Scroll-to-bottom FAB */}
          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scrollRef.current?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  position: "absolute", bottom: 82, right: 16,
                  width: 32, height: 32, borderRadius: "50%", border: `1px solid ${tk.border}`,
                  background: tk.scrollBg,
                  backdropFilter: "blur(12px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: tk.text, zIndex: 10,
                }}
              >
                <ChevronDown size={15} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ─── INPUT AREA ─── */}
          <div style={s.inputRow}>
            <div style={s.inputWrap}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder", "Écrivez un message…")}
                disabled={loading}
                style={{
                  ...s.textarea,
                  opacity: loading ? 0.5 : 1,
                }}
                onFocus={(e) => { e.target.style.borderColor = tk.borderFocus; }}
                onBlur={(e) => { e.target.style.borderColor = tk.border; }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />

              {/* Mic */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsRecording((r) => !r)}
                style={{
                  ...s.iconBtn(isRecording),
                  ...(isRecording ? { background: "rgba(239,68,68,0.12)", color: "#ef4444" } : {}),
                }}
                title="Message vocal"
              >
                <Mic size={15} />
              </motion.button>

              {/* Send / Stop */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={loading ? handleStop : () => handleAsk(input)}
                disabled={!loading && !input.trim()}
                style={{
                  ...s.sendBtn,
                  opacity: !loading && !input.trim() ? 0.38 : 1,
                  cursor: !loading && !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? <StopCircle size={15} color="#fff" />
                  : <Send size={14} color="#fff" />
                }
              </motion.button>
            </div>

            {/* Char counter */}
            {charCount > MAX_CHARS * 0.7 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  textAlign: "right", fontSize: 10, marginTop: 5,
                  color: charCount >= MAX_CHARS ? "#ef4444" : tk.textMuted,
                }}
              >
                {charCount}/{MAX_CHARS}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}