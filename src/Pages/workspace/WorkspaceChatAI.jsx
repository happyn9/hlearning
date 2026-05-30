import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Plus, X } from "lucide-react";
import { generateAIResponse } from "../../Components/ai/aiEngine";

export default function WorkspaceChatAI() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userText = message;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setMessage("");
    setLoading(true);

    setTimeout(() => {
      const aiReply = generateAIResponse(userText);

      setMessages((prev) => [...prev, { role: "bot", text: aiReply }]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
        >
          💬
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[320px] h-[420px] bg-[#0b0b0d] text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1d] border-b border-gray-700">
            <span className="text-sm font-medium">Avila AI</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">

            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-10">
                Ask me anything...
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-purple-600 self-end ml-auto"
                    : "bg-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-xs">Thinking...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-2 border-t border-gray-700 bg-[#1a1a1d]">

            <div className="flex items-center gap-2">

              <button className="text-gray-400">
                <Plus size={16} />
              </button>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI..."
                className="flex-1 bg-transparent text-sm outline-none"
              />

              <button onClick={handleSend}>
                <Send size={16} />
              </button>

              <button>
                <Mic size={16} />
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}