import React, { useState, useRef, useEffect } from "react";
import { Mic, Volume2, MoreVertical, X, Send, Sparkles, BookOpen, Code2, Lightbulb } from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────
const tokens = {
  bg: "#0F0F1A",
  surface: "#1A1728",
  surfaceHigh: "#231F35",
  border: "rgba(108,99,255,0.18)",
  accent: "#6C63FF",
  accentLight: "#A78BFA",
  accentGlow: "rgba(108,99,255,0.25)",
  text: "#F0EDFF",
  textMuted: "#8B82B8",
  green: "#34D399",
};

// ─── Inline Styles ───────────────────────────────────────────────
const styles = {
  root: {
    fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: tokens.bg,
    color: tokens.text,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    background: tokens.surface,
    borderBottom: `1px solid ${tokens.border}`,
    backdropFilter: "blur(12px)",
    zIndex: 10,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    position: "relative",
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accentLight})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    boxShadow: `0 0 0 2px ${tokens.surface}, 0 0 0 4px ${tokens.accent}`,
  },
  pulse: {
    position: "absolute",
    inset: -4,
    borderRadius: "50%",
    border: `2px solid ${tokens.accentLight}`,
    animation: "pulse 2.4s ease-in-out infinite",
    pointerEvents: "none",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: tokens.green,
    border: `2px solid ${tokens.surface}`,
    boxShadow: `0 0 8px ${tokens.green}`,
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  headerName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: tokens.text,
    letterSpacing: "0.01em",
  },
  headerStatus: {
    fontSize: 12,
    color: tokens.green,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  headerActions: {
    display: "flex",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `1px solid ${tokens.border}`,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: tokens.textMuted,
    transition: "all 0.18s ease",
  },
  body: {
    flex: 1,
    display: "flex",
    gap: 16,
    padding: "20px 24px",
    overflow: "hidden",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: tokens.surface,
    borderRadius: 20,
    border: `1px solid ${tokens.border}`,
    overflow: "hidden",
    boxShadow: `0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
  },
  messages: {
    flex: 1,
    padding: "24px 20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    scrollbarWidth: "thin",
    scrollbarColor: `${tokens.accentGlow} transparent`,
  },
  aiBubble: {
    maxWidth: "76%",
    alignSelf: "flex-start",
    background: tokens.surfaceHigh,
    border: `1px solid ${tokens.border}`,
    borderRadius: "18px 18px 18px 4px",
    padding: "14px 18px",
    fontSize: 14.5,
    lineHeight: 1.65,
    color: tokens.text,
    boxShadow: `0 2px 12px rgba(0,0,0,0.25)`,
    animation: "slideUp 0.28s cubic-bezier(.22,.68,0,1.2) both",
  },
  userBubble: {
    maxWidth: "76%",
    alignSelf: "flex-end",
    background: `linear-gradient(135deg, ${tokens.accent}, #8B5CF6)`,
    borderRadius: "18px 18px 4px 18px",
    padding: "14px 18px",
    fontSize: 14.5,
    lineHeight: 1.65,
    color: "#fff",
    boxShadow: `0 4px 20px ${tokens.accentGlow}`,
    animation: "slideUp 0.22s cubic-bezier(.22,.68,0,1.2) both",
  },
  topicsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  topicBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 99,
    border: `1px solid ${tokens.border}`,
    background: "rgba(108,99,255,0.08)",
    color: tokens.accentLight,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.18s ease",
  },
  inputBar: {
    padding: "14px 16px",
    borderTop: `1px solid ${tokens.border}`,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: tokens.surface,
  },
  input: {
    flex: 1,
    background: tokens.surfaceHigh,
    border: `1px solid ${tokens.border}`,
    borderRadius: 99,
    padding: "12px 20px",
    color: tokens.text,
    fontSize: 14.5,
    outline: "none",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${tokens.accent}, #8B5CF6)`,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "transform 0.15s ease, opacity 0.15s ease",
    boxShadow: `0 4px 18px ${tokens.accentGlow}`,
    flexShrink: 0,
  },
  sidebar: {
    width: 280,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    flexShrink: 0,
  },
  feedbackCard: {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
  },
  feedbackTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: tokens.text,
    marginBottom: 6,
  },
  feedbackDesc: {
    fontSize: 13,
    color: tokens.textMuted,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  skillBar: {
    marginBottom: 10,
  },
  skillLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: tokens.textMuted,
    marginBottom: 5,
  },
  skillTrack: {
    height: 5,
    borderRadius: 99,
    background: tokens.surfaceHigh,
    overflow: "hidden",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  statCard: {
    background: tokens.surfaceHigh,
    border: `1px solid ${tokens.border}`,
    borderRadius: 14,
    padding: "14px 12px",
    textAlign: "center",
  },
  statNum: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 22,
    color: tokens.accentLight,
  },
  statLabel: {
    fontSize: 11,
    color: tokens.textMuted,
    marginTop: 2,
  },
};

// ─── Keyframes injected once ─────────────────────────────────────
const injectCSS = () => {
  if (document.getElementById("avila-styles")) return;
  const el = document.createElement("style");
  el.id = "avila-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap');
    @keyframes pulse {
      0%,100% { opacity:0.4; transform:scale(1); }
      50%      { opacity:1;   transform:scale(1.12); }
    }
    @keyframes slideUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    #avila-input:focus {
      border-color: #6C63FF !important;
      box-shadow: 0 0 0 3px rgba(108,99,255,0.18) !important;
    }
    .avila-icon-btn:hover { background: rgba(108,99,255,0.14) !important; color: #A78BFA !important; }
    .avila-topic:hover    { background: rgba(108,99,255,0.2) !important; border-color: #6C63FF !important; transform:translateY(-1px); }
    .avila-send:disabled  { opacity:0.4; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
    .avila-send:hover:not(:disabled) { transform:scale(1.06); }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3); border-radius:99px; }
  `;
  document.head.appendChild(el);
};

// ─── Skill Bar Component ──────────────────────────────────────────
function SkillBar({ label, value, color = tokens.accent }) {
  return (
    <div style={styles.skillBar}>
      <div style={styles.skillLabel}>
        <span>{label}</span>
        <span style={{ color: tokens.accentLight }}>{value}%</span>
      </div>
      <div style={styles.skillTrack}>
        <div style={{
          height: "100%",
          width: `${value}%`,
          borderRadius: 99,
          background: `linear-gradient(90deg, ${tokens.accent}, ${tokens.accentLight})`,
          transition: "width 1.2s cubic-bezier(.22,.68,0,1)",
          boxShadow: `0 0 8px ${tokens.accentGlow}`,
        }} />
      </div>
    </div>
  );
}

// ─── Topic Button ─────────────────────────────────────────────────
function TopicButton({ icon: Icon, label, onClick }) {
  return (
    <button type="button" style={styles.topicBtn} className="avila-topic" onClick={() => onClick(label)}>
      <Icon size={13} />
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function ChatCourseAi({ onClick, topic = "Python" }) {
  injectCSS();

  const [messages, setMessages] = useState([
    { role: "ai", text: `Salut ! Je suis **Avila**, ton professeur IA. Pose-moi n'importe quelle question sur **${topic}**, ou clique sur un sujet ci-dessous pour commencer.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const txt = text ?? input;
    if (!txt.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: txt }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: "ai",
        text: `Super question sur "${txt}" ! Avila travaille encore sur sa connexion API — mais bientôt elle vous répondra en temps réel. 🚀`,
      }]);
    }, 1400);
  };

  const topics = [
    { icon: BookOpen, label: `C'est quoi ${topic} ?` },
    { icon: Code2,    label: `Coder en ${topic}` },
    { icon: Lightbulb, label: `Pourquoi ${topic} ?` },
  ];

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>A</div>
            <div style={styles.pulse} />
            <div style={styles.onlineDot} />
          </div>
          <div style={styles.headerInfo}>
            <span style={styles.headerName}>Avila</span>
            <span style={styles.headerStatus}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:tokens.green, display:"inline-block" }} />
              En ligne · IA pédagogique
            </span>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.iconBtn} className="avila-icon-btn" aria-label="Audio" type="button">
            <Volume2 size={16} />
          </button>
          <button style={styles.iconBtn} className="avila-icon-btn" aria-label="Options" type="button">
            <MoreVertical size={16} />
          </button>
          <button style={styles.iconBtn} className="avila-icon-btn" aria-label="Fermer" type="button" onClick={onClick}>
            <X size={16} />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={styles.body}>

        {/* CHAT */}
        <div style={styles.chatPanel}>
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "ai" ? styles.aiBubble : styles.userBubble}>
                {m.text}
              </div>
            ))}

            {/* Topic pills — shown after first AI message */}
            {messages.length === 1 && (
              <div style={styles.topicsWrap}>
                {topics.map(t => (
                  <TopicButton key={t.label} icon={t.icon} label={t.label} onClick={send} />
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {typing && (
              <div style={{ ...styles.aiBubble, display:"flex", gap:5, alignItems:"center", padding:"12px 16px" }}>
                {[0,1,2].map(d => (
                  <span key={d} style={{
                    width:7, height:7, borderRadius:"50%",
                    background: tokens.accentLight,
                    display:"inline-block",
                    animation:`pulse 1.2s ease-in-out ${d*0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT BAR */}
          <div style={styles.inputBar}>
            <input
              id="avila-input"
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Envoie un message à Avila…"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            <button
              style={styles.sendBtn}
              className="avila-send"
              onClick={() => send()}
              disabled={!input.trim()}
              type="button"
              aria-label="Envoyer"
            >
              <Send size={17} />
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside style={styles.sidebar}>

          {/* Stats */}
          <div style={styles.feedbackCard}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <Sparkles size={15} style={{ color: tokens.accentLight }} />
              <span style={styles.feedbackTitle}>Votre progression</span>
            </div>
            <div style={styles.statsGrid}>
              {[
                { num: "12", label: "Sessions" },
                { num: "94%", label: "Précision" },
                { num: "4h", label: "Temps total" },
                { num: "🔥 7", label: "Jours actif" },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statNum}>{s.num}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div style={styles.feedbackCard}>
            <div style={styles.feedbackTitle}>Analyse des messages</div>
            <p style={styles.feedbackDesc}>
              Avila analyse vos messages en temps réel et vous donne un retour personnalisé.
            </p>
            <SkillBar label="Clarté" value={78} />
            <SkillBar label="Vocabulaire" value={62} />
            <SkillBar label="Structure" value={85} />
          </div>

        </aside>
      </div>
    </div>
  );
}