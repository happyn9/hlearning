import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Send, Sun, Moon, Mic, Paperclip, Smile,
  X, Reply, MoreVertical, Check, CheckCheck,
  Phone, Video, Info, Loader2, ChevronDown,
  FileText, File, Users, Plus, Crown, Trash2, Copy
} from "lucide-react";
import api from "../../../services/api";
import { useUser } from "../../../context/UserContext";

/* ── Font injection ─────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("msg-fonts")) return;
  const link = document.createElement("link");
  link.id = "msg-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    .msg-root { font-family: 'DM Sans', sans-serif; }
    .msg-title { font-family: 'Syne', sans-serif; }
    @keyframes msg-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes msg-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
    @keyframes msg-shimmer { 0%{background-position:0%} 100%{background-position:200%} }
    @keyframes msg-spin { to{transform:rotate(360deg)} }
    .msg-bubble-in { animation: msg-fadein .25s ease both; }
    .msg-dot { animation: msg-bounce 1.2s ease infinite; }
    .msg-dot:nth-child(2) { animation-delay:.15s }
    .msg-dot:nth-child(3) { animation-delay:.3s }
    .msg-shimmer-btn {
      background: linear-gradient(90deg,#7c3aed,#6366f1,#7c3aed);
      background-size:200% 100%;
      animation: msg-shimmer 2.5s linear infinite;
    }
    .no-scrollbar::-webkit-scrollbar { display:none; }
    .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:rgba(124,58,237,.3); border-radius:999px; }
    .msg-member-row:hover { background:rgba(124,58,237,.08) !important; }
    .msg-menu-item:hover { background:rgba(124,58,237,.1) !important; }
    .msg-icon-btn:hover { background:rgba(255,255,255,.08) !important; }

    /* ── Responsive Messages ── */
    .msg-mobile-backdrop { display:none; }
    .msg-chat-header-back { display:none; }
    .msg-sidebar-close { display:none; }

    @media (max-width: 860px) {
      .msg-container { border-radius:0 !important; }

      .msg-left-sidebar {
        position:fixed; inset:0 20% 0 0; z-index:40;
        transform:translateX(-100%);
        transition:transform .25s ease;
        height:100% !important;
        width:auto !important;
      }
      .msg-left-sidebar.open { transform:translateX(0); }

      .msg-members-sidebar {
        position:fixed; inset:0 0 0 20%; z-index:40;
        width:auto !important;
        height:100% !important;
      }

      .msg-mobile-backdrop {
        display:block;
        position:fixed; inset:0;
        background:rgba(0,0,0,.5);
        z-index:39;
      }

      .msg-chat-header-back { display:flex !important; }
      .msg-sidebar-close { display:flex !important; }

      .msg-chat-header-actions .msg-hide-mobile { display:none !important; }
    }
  `;
  document.head.appendChild(style);
};

/* ── Constants ──────────────────────────────────────────────── */
const BASE_URL = "/api";
const REACTIONS = ["👍","❤️","😂","😮","😢","🙏"];
const PALETTES = [
  ["#7c3aed","#6366f1"],["#db2777","#f43f5e"],["#059669","#0891b2"],
  ["#d97706","#ea580c"],["#2563eb","#06b6d4"],["#9333ea","#ec4899"],
];
const palette = (name) => PALETTES[(name?.charCodeAt(0)||0) % PALETTES.length];

/* ── Helpers ─────────────────────────────────────────────────── */
const getFileUrl = (url) => { if (!url) return ""; if (url.startsWith("http")) return url; return `${BASE_URL}${url}`; };
const formatTime = (ts) => { if (!ts) return ""; return new Date(ts).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }); };
const formatDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts), today = new Date(), yesterday = new Date(today);
  yesterday.setDate(today.getDate()-1);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day:"numeric", month:"long" });
};

/* ── Avatar ─────────────────────────────────────────────────── */
function Avatar({ name, avatar, size = 36, online = false }) {
  const initials = name ? name.slice(0,2).toUpperCase() : "?";
  const [c1, c2] = palette(name);
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      {avatar
        ? <img src={avatar} alt={name} style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover" }} />
        : <div style={{
            width:size, height:size, borderRadius:"50%",
            background:`linear-gradient(135deg,${c1},${c2})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontSize:size*0.32, fontWeight:700,
            fontFamily:"Syne,sans-serif",
          }}>{initials}</div>
      }
      {online && <span style={{
        position:"absolute", bottom:1, right:1,
        width:9, height:9, borderRadius:"50%",
        background:"#34d399", border:"2px solid #0d0d14",
      }} />}
    </div>
  );
}

/* ── Attachment ─────────────────────────────────────────────── */
function Attachment({ msg, dark }) {
  const url = getFileUrl(msg.file_url);
  const type = msg.file_type || "";
  const linkStyle = {
    display:"inline-flex", alignItems:"center", gap:6,
    marginTop:6, padding:"6px 12px", borderRadius:10,
    fontSize:11, fontWeight:600, textDecoration:"none",
    background: dark ? "rgba(255,255,255,.08)" : "rgba(124,58,237,.1)",
    color: dark ? "#c4b5fd" : "#7c3aed",
    transition:"opacity .15s",
  };
  if (type.startsWith("image/")) return (
    <img src={url} alt="img" style={{ marginTop:6, borderRadius:12, maxWidth:220, maxHeight:220, objectFit:"cover", cursor:"pointer" }} />
  );
  if (type === "application/pdf") return <a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}><FileText size={13}/> Ouvrir PDF</a>;
  if (type.includes("word")||url.endsWith(".docx")||url.endsWith(".doc")) return <a href={url} download style={linkStyle}><FileText size={13}/> Télécharger .docx</a>;
  if (type.startsWith("audio/")) return <audio controls style={{ marginTop:6, width:"100%", minWidth:200, maxWidth:260 }}><source src={url} type={type}/></audio>;
  if (msg.file_url) return <a href={url} download target="_blank" rel="noopener noreferrer" style={linkStyle}><File size={13}/> Télécharger</a>;
  return null;
}

/* ── MessageBubble ──────────────────────────────────────────── */
function MessageBubble({ msg, isMine, members, onReply, onReact, onDelete, replyTo }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const menuRef = useRef(null);

  const sender = members.find((m) => m.user_id === msg.sender_id);
  const senderName = sender?.name || "Membre";
  const [c1] = palette(senderName);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) { setShowMenu(false); setShowReactions(false); } };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const bubbleStyle = {
    padding:"10px 14px",
    borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
    maxWidth:"min(340px, 78vw)", position:"relative",
    ...(isMine
      ? { background:"linear-gradient(135deg,rgba(124,58,237,.7),rgba(99,102,241,.7))", color:"#f1f5f9", boxShadow:"0 4px 20px rgba(124,58,237,.25)" }
      : { background:"rgba(255,255,255,.06)", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.08)", boxShadow:"0 2px 12px rgba(0,0,0,.3)" }
    ),
  };

  const actionBtnStyle = {
    width:28, height:28, borderRadius:"50%",
    background:"rgba(15,15,25,.8)",
    backdropFilter:"blur(8px)",
    border:"1px solid rgba(255,255,255,.1)",
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", color:"rgba(255,255,255,.6)",
    transition:"all .15s",
  };

  return (
    <div className="msg-bubble-in" style={{
      display:"flex", gap:8,
      flexDirection: isMine ? "row-reverse" : "row",
      marginBottom:2,
    }}>
      {!isMine && <Avatar name={senderName} avatar={sender?.avatar} size={30} />}

      <div style={{ display:"flex", flexDirection:"column", maxWidth:"min(360px, 82vw)", position:"relative" }} ref={menuRef}>
        {!isMine && (
          <span style={{ fontSize:11, fontWeight:700, marginBottom:4, marginLeft:4, color:c1 }}>{senderName}</span>
        )}

        {/* Reply preview */}
        {replyTo && (
          <div style={{
            marginBottom:4, padding:"6px 10px",
            borderRadius:10, borderLeft:`3px solid ${c1}`,
            background:"rgba(255,255,255,.06)", fontSize:11,
          }}>
            <p style={{ fontWeight:700, color:c1, marginBottom:1 }}>{replyTo.senderName}</p>
            <p style={{ color:"rgba(255,255,255,.45)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {replyTo.text || "📎 Fichier"}
            </p>
          </div>
        )}

        {/* Group: bubble + actions */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, flexDirection: isMine ? "row-reverse" : "row" }}>
          <div style={bubbleStyle}>
            {/* Reactions */}
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:4 }}>
                {Object.entries(msg.reactions).map(([emoji, count]) => (
                  <button key={emoji} onClick={() => onReact(msg.id, emoji)} style={{
                    display:"flex", alignItems:"center", gap:3,
                    fontSize:11, padding:"2px 7px", borderRadius:999,
                    background:"rgba(255,255,255,.12)", border:"none", cursor:"pointer",
                    transition:"transform .15s",
                  }}>{emoji} <span style={{ fontSize:10 }}>{count}</span></button>
                ))}
              </div>
            )}

            {msg.message && <p style={{ fontSize:13, lineHeight:1.55, whiteSpace:"pre-wrap", margin:0 }}>{msg.message}</p>}
            {msg.voice_url && <audio controls style={{ marginTop:6, width:"100%", minWidth:200, maxWidth:260 }}><source src={getFileUrl(msg.voice_url)} type="audio/webm"/></audio>}
            {msg.file_url && <Attachment msg={msg} dark />}

            <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4, marginTop:4 }}>
              <span style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>{formatTime(msg.timestamp)}</span>
              {isMine && <CheckCheck size={11} style={{ color:"#60a5fa" }} />}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", flexDirection:"column", gap:3, opacity:0, transition:"opacity .2s" }}
            className="msg-actions">
            <button style={actionBtnStyle} onClick={() => setShowReactions(p=>!p)}><Smile size={12}/></button>
            <button style={actionBtnStyle} onClick={() => onReply(msg)}><Reply size={12}/></button>
            <button style={actionBtnStyle} onClick={() => setShowMenu(p=>!p)}><MoreVertical size={12}/></button>
          </div>
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div style={{
            position:"absolute", [isMine?"right":"left"]:0, top:-44, zIndex:30,
            display:"flex", gap:4, padding:"8px 12px", borderRadius:20,
            background:"rgba(15,15,25,.95)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(255,255,255,.1)",
            boxShadow:"0 8px 32px rgba(0,0,0,.6)",
          }}>
            {REACTIONS.map(e => (
              <button key={e} onClick={() => { onReact(msg.id, e); setShowReactions(false); }}
                style={{ fontSize:18, background:"none", border:"none", cursor:"pointer", transition:"transform .15s", lineHeight:1 }}
                onMouseEnter={el=>el.currentTarget.style.transform="scale(1.3)"}
                onMouseLeave={el=>el.currentTarget.style.transform="scale(1)"}
              >{e}</button>
            ))}
          </div>
        )}

        {/* Context menu */}
        {showMenu && (
          <div style={{
            position:"absolute", [isMine?"right":"left"]:0, top:40, zIndex:30,
            width:160, borderRadius:14, overflow:"hidden",
            background:"rgba(15,15,25,.97)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(255,255,255,.1)",
            boxShadow:"0 8px 32px rgba(0,0,0,.7)",
          }}>
            {[
              { icon:Reply, label:"Répondre", action:()=>{ onReply(msg); setShowMenu(false); } },
              { icon:Copy, label:"Copier", action:()=>{ navigator.clipboard.writeText(msg.message||""); setShowMenu(false); } },
              ...(msg.sender_id ? [{ icon:Trash2, label:"Supprimer", action:()=>{ onDelete(msg.id); setShowMenu(false); }, red:true }] : []),
            ].map(({icon:Icon, label, action, red}) => (
              <button key={label} onClick={action} className="msg-menu-item" style={{
                display:"flex", alignItems:"center", gap:10, width:"100%",
                padding:"10px 14px", fontSize:12, fontWeight:500,
                background:"none", border:"none", cursor:"pointer",
                color: red ? "#f87171" : "rgba(255,255,255,.75)",
                transition:"background .15s",
              }}>
                <Icon size={13}/> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CSS trick for hover actions */}
      <style>{`.msg-bubble-in:hover .msg-actions { opacity:1!important; }`}</style>
    </div>
  );
}

/* ── InviteModal ─────────────────────────────────────────────── */
function InviteModal({ workspaceId, onClose, onDone }) {
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const inputStyle = {
    width:"100%", boxSizing:"border-box",
    background:"rgba(255,255,255,.06)",
    border:"1px solid rgba(255,255,255,.1)",
    borderRadius:12, padding:"12px 16px",
    fontSize:13, color:"#f1f5f9",
    outline:"none", marginBottom:10,
    fontFamily:"DM Sans,sans-serif",
    transition:"border-color .2s",
  };

  const send = async () => {
    if (!identifier.trim()) return;
    setLoading(true); setStatus(null);
    try {
      await api.post(`/workspaces/${workspaceId}/invite`, { identifier, role });
      setStatus({ type:"ok", msg:`✅ ${identifier} invité !` });
      setIdentifier(""); onDone?.();
    } catch (e) { setStatus({ type:"err", msg:e.message || "Introuvable ou déjà membre" }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:50,
      background:"rgba(0,0,0,.7)", backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        background:"#0d0d18",
        border:"1px solid rgba(255,255,255,.1)",
        borderRadius:20, width:"100%", maxWidth:420, padding:24,
        boxShadow:"0 40px 100px rgba(0,0,0,.8)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 className="msg-title" style={{ color:"#f1f5f9", fontSize:16, fontWeight:700, margin:0 }}>Inviter un membre</h3>
          <button onClick={onClose} style={{
            width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,.08)",
            border:"none", cursor:"pointer", color:"rgba(255,255,255,.6)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><X size={14}/></button>
        </div>

        <input value={identifier} onChange={e=>setIdentifier(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Email ou @username"
          style={inputStyle}
          onFocus={e=>e.target.style.borderColor="rgba(124,58,237,.6)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
        />
        <select value={role} onChange={e=>setRole(e.target.value)}
          style={{ ...inputStyle, cursor:"pointer" }}>
          <option value="member">Membre</option>
          <option value="admin">Admin</option>
        </select>

        {status && (
          <div style={{
            padding:"10px 14px", borderRadius:10, fontSize:12, marginBottom:10,
            background: status.type==="ok" ? "rgba(52,211,153,.12)" : "rgba(248,113,113,.12)",
            color: status.type==="ok" ? "#34d399" : "#f87171",
            border: `1px solid ${status.type==="ok" ? "rgba(52,211,153,.2)" : "rgba(248,113,113,.2)"}`,
          }}>{status.msg}</div>
        )}

        <button onClick={send} disabled={loading||!identifier.trim()} className="msg-shimmer-btn"
          style={{
            width:"100%", padding:"13px", borderRadius:12,
            color:"#fff", fontSize:13, fontWeight:700,
            border:"none", cursor:loading||!identifier.trim()?"not-allowed":"pointer",
            opacity:loading||!identifier.trim()?0.5:1,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            fontFamily:"DM Sans,sans-serif",
          }}>
          {loading ? <Loader2 size={15} style={{ animation:"msg-spin 1s linear infinite" }}/> : <Plus size={15}/>}
          {loading ? "Invitation…" : "Inviter"}
        </button>
      </div>
    </div>
  );
}

/* ── MembersSidebar ─────────────────────────────────────────── */
function MembersSidebar({ workspaceId, members, loading, isAdmin, onInvite, onClose }) {
  return (
    <div className="msg-members-sidebar" style={{
      width:260, display:"flex", flexDirection:"column",
      background:"rgba(10,10,20,.95)", backdropFilter:"blur(20px)",
      borderLeft:"1px solid rgba(255,255,255,.08)",
      flexShrink:0,
    }}>
      <div style={{
        padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:"1px solid rgba(255,255,255,.06)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Users size={14} style={{ color:"#a78bfa" }}/>
          <span className="msg-title" style={{ fontWeight:700, fontSize:13, color:"#f1f5f9" }}>
            {members.length} membre{members.length>1?"s":""}
          </span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {isAdmin && (
            <button onClick={onInvite} style={{
              width:28, height:28, borderRadius:8,
              background:"rgba(124,58,237,.2)", color:"#a78bfa",
              border:"1px solid rgba(124,58,237,.3)",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              transition:"all .15s",
            }}><Plus size={13}/></button>
          )}
          <button onClick={onClose} style={{
            width:28, height:28, borderRadius:8,
            background:"rgba(255,255,255,.05)", color:"rgba(255,255,255,.5)",
            border:"1px solid rgba(255,255,255,.08)",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
          }}><X size={13}/></button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
        {loading
          ? <div style={{ display:"flex", justifyContent:"center", padding:24 }}><Loader2 size={18} style={{ color:"#a78bfa", animation:"msg-spin 1s linear infinite" }}/></div>
          : members.map((m) => (
            <div key={m.id} className="msg-member-row" style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"8px 10px", borderRadius:12, cursor:"default",
              transition:"background .15s",
            }}>
              <Avatar name={m.name} avatar={m.avatar} size={32} online/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:"#e2e8f0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>{m.name}</p>
                  {m.role==="admin" && <Crown size={10} style={{ color:"#fbbf24", flexShrink:0 }}/>}
                </div>
                <p style={{ fontSize:11, color:"rgba(255,255,255,.3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>{m.email}</p>
              </div>
            </div>
          ))
        }
      </div>

      {isAdmin && (
        <div style={{ padding:"10px 10px", borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <button onClick={onInvite} style={{
            width:"100%", padding:"10px", borderRadius:12,
            border:"2px dashed rgba(124,58,237,.3)", background:"none",
            color:"#a78bfa", fontSize:12, fontWeight:600, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"all .2s", fontFamily:"DM Sans,sans-serif",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(124,58,237,.7)"; e.currentTarget.style.background="rgba(124,58,237,.08)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(124,58,237,.3)"; e.currentTarget.style.background="none"; }}
          ><Plus size={13}/> Inviter</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function Messages({ workspaceId, workspace }) {
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [timer, setTimer] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // drawer mobile: liste membres à gauche
  const [showInvite, setShowInvite] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [reactions, setReactions] = useState({});
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  const typingTimers = useRef({});

  useEffect(() => { injectFonts(); }, []);

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;
    setMembersLoading(true);
    try {
      const res = await api.get(`/workspaces/${workspaceId}/members`);
      const list = res.members || [];
      setMembers(list);
      const me = list.find((m) => m.user_id === user?.id);
      setIsAdmin(me?.role === "admin");
    } catch (_) {}
    finally { setMembersLoading(false); }
  }, [workspaceId, user?.id]);

  useEffect(() => {
    if (!workspaceId) return;
    fetchMembers();
    api.get(`/workspaces/${workspaceId}/messages`).then((data) => setMessages(Array.isArray(data) ? data : [])).catch(console.error);

    if (socketRef.current?.readyState <= 1) socketRef.current.close();
    const ws = new WebSocket(`ws://localhost:8000/workspaces/ws/${workspaceId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") setMessages((prev) => prev.find((m) => m.id === data.payload.id) ? prev : [...prev, data.payload]);
        if (data.type === "typing") {
          const uid = data.userId;
          setTypingUsers((prev) => ({ ...prev, [uid]: data.user }));
          clearTimeout(typingTimers.current[uid]);
          typingTimers.current[uid] = setTimeout(() => setTypingUsers((prev) => { const n={...prev}; delete n[uid]; return n; }), 2000);
        }
        if (data.type === "reaction") setReactions((prev) => { const r={...(prev[data.msgId]||{})}; r[data.emoji]=(r[data.emoji]||0)+1; return {...prev,[data.msgId]:r}; });
        if (data.type === "delete") setMessages((prev) => prev.filter((m) => m.id !== data.msgId));
      } catch(e) { console.error("WS parse error", e); }
    };
    ws.onerror = console.error;
    return () => { if (ws.readyState <= 1) ws.close(); };
  }, [workspaceId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const payload = { message: input };
      if (replyingTo) payload.reply_to_id = replyingTo.id;
      const msg = await api.post(`/workspaces/${workspaceId}/messages`, payload);
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.send(JSON.stringify({ type:"message", payload:msg }));
      setInput(""); setReplyingTo(null);
    } catch(err) { console.error(err); }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current?.send(JSON.stringify({ type:"typing", userId:user?.id, user:user?.name||"Quelqu'un" }));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20*1024*1024) { alert("Max 20 MB"); return; }
    setUploadProgress("upload");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const upload = await api.post("/upload", formData);
      const msg = await api.post(`/workspaces/${workspaceId}/messages`, { file_url:upload.url, file_type:file.type });
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.send(JSON.stringify({ type:"message", payload:msg }));
    } catch(err) { console.error(err); }
    finally { setUploadProgress(null); e.target.value=""; }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => { const blob = new Blob(chunks, { type:"audio/webm" }); setAudioBlob(blob); setAudioPreview(URL.createObjectURL(blob)); };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setTimer(0);
      intervalRef.current = setInterval(() => setTimer((t) => t+1), 1000);
      setRecording(true);
    } catch { alert("Micro refusé"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(intervalRef.current);
    setRecording(false);
  };

  const cancelVoice = () => { setAudioBlob(null); setAudioPreview(null); setTimer(0); };

  const sendVoice = async () => {
    if (!audioBlob) return;
    setUploadProgress("voice");
    const formData = new FormData();
    formData.append("file", audioBlob, "voice.webm");
    try {
      const upload = await api.post("/upload", formData);
      const msg = await api.post(`/workspaces/${workspaceId}/messages`, { voice_url:upload.url });
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.send(JSON.stringify({ type:"message", payload:msg }));
      cancelVoice();
    } catch(err) { console.error(err); }
    finally { setUploadProgress(null); }
  };

  const handleReact = (msgId, emoji) => {
    setReactions((prev) => { const r={...(prev[msgId]||{})}; r[emoji]=(r[emoji]||0)+1; return {...prev,[msgId]:r}; });
    socketRef.current?.send(JSON.stringify({ type:"reaction", msgId, emoji }));
  };

  const handleReply = (msg) => {
    const sender = members.find((m) => m.user_id === msg.sender_id);
    setReplyingTo({ id:msg.id, senderName:sender?.name||"Membre", text:msg.message });
  };

  const handleDelete = (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    socketRef.current?.send(JSON.stringify({ type:"delete", msgId }));
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.timestamp);
    if (!acc.length || acc[acc.length-1].date !== date) acc.push({ date, msgs:[msg] });
    else acc[acc.length-1].msgs.push(msg);
    return acc;
  }, []);

  const typingList = Object.values(typingUsers).filter((n) => n !== user?.name);
  const [wc1, wc2] = palette(workspace || "W");

  /* ── Shared styles ── */
  const iconBtnStyle = {
    width:32, height:32, borderRadius:10,
    background:"rgba(255,255,255,.06)",
    border:"1px solid rgba(255,255,255,.08)",
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", color:"rgba(255,255,255,.55)",
    transition:"all .15s",
  };

  return (
    <div className="msg-root msg-container" style={{
      display:"flex", height:"calc(100dvh - 32px)",
      background:"#0a0a12",
      backgroundImage:"radial-gradient(ellipse 70% 60% at 10% 90%, rgba(124,58,237,.1) 0%, transparent 55%)",
      borderRadius:20, overflow:"hidden",
      boxShadow:"0 40px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)",
      position:"relative",
    }}>

      {/* Backdrop mobile pour fermer les drawers */}
      {(showSidebar || showMembers) && (
        <div
          className="msg-mobile-backdrop"
          onClick={() => { setShowSidebar(false); setShowMembers(false); }}
        />
      )}

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div className={`msg-left-sidebar ${showSidebar ? "open" : ""}`} style={{
        width:260, display:"flex", flexDirection:"column",
        background:"rgba(8,8,16,.95)",
        borderRight:"1px solid rgba(255,255,255,.06)",
        flexShrink:0,
      }}>
        {/* Header */}
        <div style={{
          padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
          borderBottom:"1px solid rgba(255,255,255,.06)",
        }}>
          <h2 className="msg-title" style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:0, letterSpacing:-.3 }}>Messages</h2>
          <div style={{ display:"flex", gap:4 }}>
            {isAdmin && (
              <button onClick={() => setShowInvite(true)} style={{ ...iconBtnStyle, background:"rgba(124,58,237,.2)", color:"#a78bfa", border:"1px solid rgba(124,58,237,.3)" }} title="Inviter">
                <Plus size={14}/>
              </button>
            )}
            <button
              onClick={() => setShowSidebar(false)}
              className="msg-sidebar-close"
              style={iconBtnStyle}
              title="Fermer"
            ><X size={14}/></button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding:"10px 12px" }}>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,.05)",
            border:"1px solid rgba(255,255,255,.08)",
            borderRadius:12, padding:"8px 12px",
          }}>
            <Search size={13} style={{ color:"rgba(255,255,255,.3)" }}/>
            <input placeholder="Rechercher…" style={{
              background:"none", border:"none", outline:"none",
              fontSize:12, color:"rgba(255,255,255,.7)",
              flex:1, fontFamily:"DM Sans,sans-serif",
            }} className="msg-search-placeholder"/>
          </div>
        </div>

        {/* Workspace item */}
        <div style={{
          margin:"0 12px 4px",
          display:"flex", alignItems:"center", gap:10,
          padding:"10px 12px", borderRadius:14, cursor:"pointer",
          background:"rgba(124,58,237,.12)",
          border:"1px solid rgba(124,58,237,.25)",
        }}>
          <div style={{
            width:38, height:38, borderRadius:12,
            background:`linear-gradient(135deg,${wc1},${wc2})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontWeight:800, fontSize:16,
            fontFamily:"Syne,sans-serif",
            boxShadow:`0 4px 16px ${wc1}55`,
          }}>
            {(workspace||"W")[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#f1f5f9", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{workspace}</p>
            <p style={{ fontSize:10, color:"rgba(255,255,255,.35)", margin:0 }}>{members.length} membres</p>
          </div>
          {messages.length > 0 && (
            <span style={{ fontSize:9, color:"rgba(255,255,255,.3)" }}>{formatTime(messages[messages.length-1]?.timestamp)}</span>
          )}
        </div>

        {/* Members list */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,.25)", padding:"4px 8px 8px", margin:0 }}>Membres</p>
          {membersLoading
            ? <div style={{ display:"flex", justifyContent:"center", padding:16 }}><Loader2 size={16} style={{ color:"#a78bfa", animation:"msg-spin 1s linear infinite" }}/></div>
            : members.map((m) => (
              <div key={m.id} className="msg-member-row" style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"7px 8px", borderRadius:10, cursor:"default",
                transition:"background .15s",
              }}>
                <Avatar name={m.name} avatar={m.avatar} size={28} online/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <p style={{ fontSize:11, fontWeight:600, color:"#cbd5e1", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</p>
                    {m.role==="admin" && <Crown size={9} style={{ color:"#fbbf24", flexShrink:0 }}/>}
                  </div>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,.25)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.email}</p>
                </div>
              </div>
            ))
          }
          {isAdmin && (
            <button onClick={() => setShowInvite(true)} style={{
              width:"100%", padding:"8px", borderRadius:10,
              border:"2px dashed rgba(124,58,237,.25)", background:"none",
              color:"rgba(167,139,250,.6)", fontSize:11, fontWeight:600,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:5, marginTop:4,
              transition:"all .2s", fontFamily:"DM Sans,sans-serif",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(124,58,237,.6)"; e.currentTarget.style.color="#a78bfa"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(124,58,237,.25)"; e.currentTarget.style.color="rgba(167,139,250,.6)"; }}
            ><Plus size={11}/> Inviter un ami</button>
          )}
        </div>
      </div>

      {/* ═══ CHAT AREA ═══ */}
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", minWidth:0 }}>

        {/* Chat header */}
        <div style={{
          padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"rgba(8,8,16,.9)", backdropFilter:"blur(12px)",
          borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
            <button
              className="msg-chat-header-back"
              style={iconBtnStyle}
              onClick={() => setShowSidebar(true)}
              title="Conversations"
            ><Users size={16}/></button>

            <div style={{
              width:34, height:34, borderRadius:10, flexShrink:0,
              background:`linear-gradient(135deg,${wc1},${wc2})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:800, fontSize:14, fontFamily:"Syne,sans-serif",
              boxShadow:`0 4px 12px ${wc1}44`,
            }}>{(workspace||"W")[0].toUpperCase()}</div>
            <div style={{ minWidth:0 }}>
              <p className="msg-title" style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Workspace Chat</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,.35)", margin:0 }}>{members.length} participants</p>
            </div>
          </div>

          <div className="msg-chat-header-actions" style={{ display:"flex", gap:4, flexShrink:0 }}>
            <button className="msg-hide-mobile" style={iconBtnStyle}><Video size={16}/></button>
            <button className="msg-hide-mobile" style={iconBtnStyle}><Phone size={16}/></button>
            <button style={iconBtnStyle} onClick={()=>setShowMembers(p=>!p)}><Info size={16}/></button>
          </div>
        </div>

        {/* Messages scroll area */}
        <div ref={chatRef} onScroll={handleScroll} className="no-scrollbar" style={{
          flex:1, overflowY:"auto", padding:"20px 24px",
          display:"flex", flexDirection:"column", gap:2,
        }}>
          {groupedMessages.map(({ date, msgs }) => (
            <div key={date}>
              <div style={{ display:"flex", justifyContent:"center", margin:"16px 0" }}>
                <span style={{
                  fontSize:10, fontWeight:600, letterSpacing:.5,
                  padding:"4px 12px", borderRadius:999,
                  background:"rgba(255,255,255,.06)",
                  border:"1px solid rgba(255,255,255,.08)",
                  color:"rgba(255,255,255,.4)",
                }}>{date}</span>
              </div>
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={{ ...msg, reactions: { ...(reactions[msg.id]||{}), ...(msg.reactions||{}) } }}
                  isMine={msg.sender_id === user?.id}
                  members={members}
                  onReply={handleReply}
                  onReact={handleReact}
                  onDelete={handleDelete}
                  replyTo={msg.reply_to_id ? (() => {
                    const orig = messages.find((m) => m.id === msg.reply_to_id);
                    if (!orig) return null;
                    const s = members.find((m) => m.user_id === orig.sender_id);
                    return { senderName:s?.name||"Membre", text:orig.message };
                  })() : null}
                />
              ))}
            </div>
          ))}

          {/* Typing indicator */}
          {typingList.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:4, paddingBottom:4 }}>
              <div style={{
                display:"flex", gap:4, padding:"8px 12px", borderRadius:16,
                background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)",
              }}>
                {[0,1,2].map(i => <span key={i} className="msg-dot" style={{ width:6, height:6, borderRadius:"50%", background:"rgba(167,139,250,.7)", display:"block", animationDelay:`${i*.15}s` }}/>)}
              </div>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{typingList.join(", ")} écrit…</span>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* Scroll to bottom btn */}
        {showScrollBtn && (
          <button onClick={() => bottomRef.current?.scrollIntoView({ behavior:"smooth" })} style={{
            position:"absolute", bottom:90, right:showMembers?280:20,
            width:34, height:34, borderRadius:"50%",
            background:"linear-gradient(135deg,#7c3aed,#6366f1)",
            color:"#fff", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 16px rgba(124,58,237,.5)", zIndex:10,
            transition:"right .25s",
          }}><ChevronDown size={16}/></button>
        )}

        {/* Upload progress */}
        {uploadProgress && (
          <div style={{
            padding:"8px 20px", display:"flex", alignItems:"center", gap:8,
            background:"rgba(8,8,16,.9)", borderTop:"1px solid rgba(255,255,255,.05)",
          }}>
            <Loader2 size={12} style={{ color:"#a78bfa", animation:"msg-spin 1s linear infinite" }}/>
            <span style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>
              {uploadProgress==="voice" ? "Envoi du vocal…" : "Envoi du fichier…"}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {replyingTo && (
          <div style={{
            padding:"10px 20px", display:"flex", alignItems:"center", gap:12,
            background:"rgba(8,8,16,.9)", borderTop:"1px solid rgba(255,255,255,.05)",
          }}>
            <div style={{ flex:1, minWidth:0, borderLeft:"3px solid #7c3aed", paddingLeft:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#a78bfa", margin:0 }}>{replyingTo.senderName}</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,.35)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{replyingTo.text||"📎 Fichier"}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} style={{
              width:24, height:24, borderRadius:"50%",
              background:"rgba(255,255,255,.08)", border:"none",
              cursor:"pointer", color:"rgba(255,255,255,.5)",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}><X size={12}/></button>
          </div>
        )}

        {/* Input bar */}
        <div style={{
          padding:"12px 16px",
          background:"rgba(8,8,16,.95)", backdropFilter:"blur(12px)",
          borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0,
        }}>
          {recording ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#f87171", animation:"msg-bounce 1s ease infinite", display:"block", flexShrink:0 }}/>
                <span style={{ fontFamily:"monospace", fontSize:13, color:"#f1f5f9", flexShrink:0 }}>
                  {String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}
                </span>
                <div style={{ flex:1, height:3, borderRadius:999, background:"rgba(255,255,255,.1)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:999, background:"#f87171", width:`${Math.min(timer*3,100)}%`, transition:"width 1s linear" }}/>
                </div>
              </div>
              <button onClick={cancelVoice} style={{ ...iconBtnStyle, borderRadius:"50%" }}><X size={14}/></button>
              <button onClick={stopRecording} style={{
                width:34, height:34, borderRadius:"50%",
                background:"#f87171", color:"#fff", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}><Check size={14}/></button>
            </div>
          ) : audioPreview ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <audio controls src={audioPreview} style={{ flex:1, height:32, minWidth:0 }}/>
              <button onClick={cancelVoice} style={{ ...iconBtnStyle, borderRadius:"50%" }}><Trash2 size={13}/></button>
              <button onClick={sendVoice} disabled={!!uploadProgress} style={{
                width:34, height:34, borderRadius:"50%",
                background:"linear-gradient(135deg,#7c3aed,#6366f1)",
                color:"#fff", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:uploadProgress?0.5:1,
                boxShadow:"0 4px 16px rgba(124,58,237,.4)",
                flexShrink:0,
              }}>
                {uploadProgress ? <Loader2 size={14} style={{ animation:"msg-spin 1s linear infinite" }}/> : <Send size={14}/>}
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <label style={{ ...iconBtnStyle, cursor:"pointer", borderRadius:10, flexShrink:0 }}>
                <Paperclip size={16}/>
                <input type="file" hidden onChange={handleFile} accept="*/*"/>
              </label>

              <div style={{
                flex:1, display:"flex", alignItems:"center", gap:8, minWidth:0,
                background:"rgba(255,255,255,.06)",
                border:"1px solid rgba(255,255,255,.08)",
                borderRadius:14, padding:"8px 14px",
                transition:"border-color .2s",
              }}
              onFocusCapture={e => e.currentTarget.style.borderColor="rgba(124,58,237,.4)"}
              onBlurCapture={e => e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
              >
                <input
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Écrire un message…"
                  style={{
                    flex:1, minWidth:0, background:"none", border:"none", outline:"none",
                    fontSize:13, color:"#f1f5f9",
                    fontFamily:"DM Sans,sans-serif",
                  }}
                />
              </div>

              {input.trim() ? (
                <button onClick={sendMessage} style={{
                  width:36, height:36, borderRadius:12, flexShrink:0,
                  background:"linear-gradient(135deg,#7c3aed,#6366f1)",
                  color:"#fff", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 16px rgba(124,58,237,.45)",
                  transition:"transform .15s, box-shadow .15s",
                }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(124,58,237,.6)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,.45)"; }}
                ><Send size={15}/></button>
              ) : (
                <button onClick={startRecording} style={{ ...iconBtnStyle, borderRadius:12, flexShrink:0 }} className="msg-icon-btn">
                  <Mic size={16}/>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ MEMBERS PANEL ═══ */}
      {showMembers && (
        <MembersSidebar
          workspaceId={workspaceId}
          members={members}
          loading={membersLoading}
          isAdmin={isAdmin}
          onInvite={() => { setShowMembers(false); setShowInvite(true); }}
          onClose={() => setShowMembers(false)}
        />
      )}

      {/* ═══ INVITE MODAL ═══ */}
      {showInvite && (
        <InviteModal
          workspaceId={workspaceId}
          onClose={() => setShowInvite(false)}
          onDone={fetchMembers}
        />
      )}
    </div>
  );
}