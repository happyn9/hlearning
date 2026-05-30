import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Plus } from "lucide-react";
import logo from "/src/assets/logo1.png";
import { generateAIResponse } from "../../Components/ai/aiEngine";

export default function ChatPage({ onClose }) {
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userText = message;

    setStarted(true);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
    ]);

    setMessage("");

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
    <div className="h-screen z-50 absolute left-0 top-0 w-full bg-[#0b0b0d] text-white flex flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-7" />
          <span className="text-gray-300 text-lg">Avila</span>
        </div>

        <div className="flex gap-2">
          <button className="bg-slate-700 px-4 py-2 rounded-full text-sm hover:bg-slate-800">
            Upgrade
          </button>

          <button
            onClick={onClose}
            className="bg-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-500"
          >
            X
          </button>
        </div>
      </header>

      {/* CHAT */}
      <main className="flex-1 overflow-y-auto px-4">

        {!started && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl text-gray-400 mb-6">
              What would you like to talk about ?
            </h1>
          </div>
        )}

        {started && (
          <div className="max-w-3xl mx-auto flex flex-col gap-4 py-6">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 self-end"
                    : "bg-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* INPUT */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto bg-[#1a1a1d] border border-gray-700 rounded-2xl p-3">

          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <div className="flex gap-2 items-center">
              <Plus size={16} /> Tools
            </div>
            Fast ▾
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Avila"
              className="flex-1 bg-transparent outline-none"
            />

            <button onClick={handleSend}>
              <Send size={18} />
            </button>

            <button>
              <Mic size={18} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 pb-3">
        Avila can make mistakes.
      </p>
    </div>
  );
}