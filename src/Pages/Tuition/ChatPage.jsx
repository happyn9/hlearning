import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Plus, Paperclip, X, FileText, Image as ImageIcon, Stamp } from "lucide-react";
import logo from "/src/assets/logo1.png";
import { generateAIResponse } from "../../Components/ai/aiEngine";

export default function ChatPage({ onClose }) {
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handlePickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const mapped = files.map((f) => ({
      name: f.name,
      size: f.size,
      isImage: f.type.startsWith("image/"),
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeAttachment = (name) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    const userText = message;
    const userFiles = attachments;

    setStarted(true);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, files: userFiles },
    ]);

    setMessage("");
    setAttachments([]);

    setTimeout(() => {
      const aiReply = generateAIResponse(userText);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: aiReply },
      ]);

      setLoading(false);
    }, 700);
  };

  return (
    <div
      className="h-screen z-50 fixed left-0 top-0 w-full flex flex-col"
      style={{
        background: "var(--td-bg, #11152a)",
        backgroundImage: "radial-gradient(circle at 10% 0%, rgba(255,107,74,0.05), transparent 40%)",
        color: "var(--td-text, #f3efe2)",
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* HEADER */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--td-border, rgba(245,241,230,0.12))" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: "var(--td-coral, #ff6b4a)", transform: "rotate(-3deg)" }}
          >
            <Stamp size={15} color="#11152a" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display, serif)", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
              Avila
            </div>
            <div
              style={{
                fontFamily: "var(--font-stamp, monospace)",
                fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--td-muted, #707599)",
              }}
            >
              Your travel companion
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
            style={{
              background: "var(--td-gold-soft, rgba(232,179,57,0.12))",
              border: "1px solid rgba(232,179,57,0.35)",
              color: "var(--td-gold, #e8b339)",
              fontFamily: "var(--font-stamp, monospace)",
              letterSpacing: "0.04em",
            }}
          >
            Upgrade
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-85"
            style={{ background: "var(--td-surface, rgba(245,241,230,0.05))", border: "1px solid var(--td-border, rgba(245,241,230,0.12))" }}
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* CHAT */}
      <main className="flex-1 overflow-y-auto px-4 td-scrollbar">
        {!started && (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
              style={{ border: "1.5px dashed var(--td-border-med, rgba(245,241,230,0.22))" }}
            >
              <Stamp size={20} color="var(--td-coral, #ff6b4a)" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display, serif)",
                fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em",
                color: "var(--td-text, #f3efe2)", marginBottom: 8,
              }}
            >
              Where shall we begin?
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--td-sub, #aeb1c9)", maxWidth: 360 }}>
              Ask a question, paste a paragraph to correct, or attach a file — Avila reads it all.
            </p>
          </div>
        )}

        {started && (
          <div className="max-w-3xl mx-auto flex flex-col gap-4 py-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1.5 max-w-[80%] justify-end">
                    {msg.files.map((f, fi) => (
                      <FileChip key={fi} file={f} />
                    ))}
                  </div>
                )}
                {msg.text && (
                  <div
                    className="px-4 py-3 rounded-2xl max-w-[80%] text-[14px] leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: "var(--td-coral, #ff6b4a)", color: "#11152a", borderBottomRightRadius: 4 }
                        : {
                            background: "var(--td-surface, rgba(245,241,230,0.05))",
                            border: "1px solid var(--td-border, rgba(245,241,230,0.12))",
                            color: "var(--td-text, #f3efe2)",
                            borderBottomLeftRadius: 4,
                          }
                    }
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2" style={{ color: "var(--td-muted, #707599)" }}>
                <div
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{ border: "2px solid var(--td-gold, #e8b339)", borderTopColor: "transparent" }}
                />
                <span style={{ fontFamily: "var(--font-stamp, monospace)", fontSize: 12, letterSpacing: "0.04em" }}>
                  Avila is thinking…
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* INPUT */}
      <div className="p-4">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-3"
          style={{
            background: "var(--td-surface-solid, #1a2040)",
            border: "1px solid var(--td-border-med, rgba(245,241,230,0.22))",
          }}
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid var(--td-border, rgba(245,241,230,0.12))" }}>
              {attachments.map((f, i) => (
                <FileChip key={i} file={f} onRemove={() => removeAttachment(f.name)} />
              ))}
            </div>
          )}

          <div
            className="flex justify-between items-center text-sm mb-2"
            style={{ color: "var(--td-muted, #707599)" }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex gap-1.5 items-center transition-colors hover:opacity-80"
              style={{ fontFamily: "var(--font-stamp, monospace)", fontSize: 11, letterSpacing: "0.04em" }}
            >
              <Paperclip size={14} /> ATTACH
            </button>
            <span style={{ fontFamily: "var(--font-stamp, monospace)", fontSize: 11, letterSpacing: "0.04em" }}>
              FAST ▾
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handlePickFiles}
            className="hidden"
          />

          <div className="flex gap-2 items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Avila"
              className="flex-1 bg-transparent outline-none text-[14px]"
              style={{ color: "var(--td-text, #f3efe2)" }}
            />

            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-85"
              style={{ background: "var(--td-coral, #ff6b4a)", color: "#11152a" }}
            >
              <Send size={14} />
            </button>

            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ border: "1px solid var(--td-border-med, rgba(245,241,230,0.22))", color: "var(--td-sub, #aeb1c9)" }}
            >
              <Mic size={14} />
            </button>
          </div>
        </div>
      </div>

      <p
        className="text-center pb-3"
        style={{ fontSize: 10.5, color: "var(--td-muted, #707599)", fontFamily: "var(--font-stamp, monospace)", letterSpacing: "0.03em" }}
      >
        Avila can make mistakes. Verify important information.
      </p>
    </div>
  );
}

function FileChip({ file, onRemove }) {
  return (
    <div
      className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-lg"
      style={{
        background: "var(--td-surface, rgba(245,241,230,0.05))",
        border: "1px solid var(--td-border, rgba(245,241,230,0.12))",
        maxWidth: 200,
      }}
    >
      {file.isImage && file.url ? (
        <img src={file.url} alt={file.name} className="w-6 h-6 rounded object-cover shrink-0" />
      ) : (
        <div
          className="w-6 h-6 rounded flex items-center justify-center shrink-0"
          style={{ background: "var(--td-coral-soft, rgba(255,107,74,0.12))" }}
        >
          {file.isImage ? <ImageIcon size={12} color="var(--td-coral, #ff6b4a)" /> : <FileText size={12} color="var(--td-coral, #ff6b4a)" />}
        </div>
      )}
      <span className="text-[11.5px] truncate" style={{ color: "var(--td-text, #f3efe2)" }}>
        {file.name}
      </span>
      {onRemove && (
        <button onClick={onRemove} className="shrink-0 opacity-60 hover:opacity-100">
          <X size={11} />
        </button>
      )}
    </div>
  );
}