import React, { useState } from "react";
import { Mic, Volume2, MoreVertical, X } from "lucide-react";
import avatar from "/src/assets/logo.png";

export default function ChatCourseAi({ onClick, topic }) {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => setMessage(e.target.value);
  const handleSend = () => {
    if (message.trim() === "") return;
    console.log("Envoyer message:", message);
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-indigo-50 via-white to-gray-100">

      {/* HEADER */}
      <header className="flex justify-end px-4 md:px-6 py-3 bg-white shadow-md">
        <button
          aria-label="Close chat"
          className="p-2 rounded-full hover:bg-indigo-100 active:scale-95 transition-transform duration-150 shadow-sm"
          type="button"
          onClick={onClick}
        >
          <X size={20} className="text-indigo-700" />
        </button>
      </header>

      {/* BODY */}
      <main className="flex flex-1 flex-col lg:flex-row gap-4 md:gap-6 px-4 md:px-6 py-3 max-w-7xl mx-auto w-full">

        {/* CHAT PANEL */}
        <section className="flex-1 h-[80vh] lg:h-[90%] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">

          {/* CHAT HEADER */}
          <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-indigo-900">Avila</p>
                <span className="block w-3 h-3 bg-green-500 rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex gap-3 text-indigo-600">
              <Volume2 size={20} className="hover:text-indigo-800 cursor-pointer transition" />
              <MoreVertical size={20} className="hover:text-indigo-800 cursor-pointer transition" />
            </div>
          </header>

          {/* MESSAGE AREA */}
          <article className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100">
            <div className="bg-indigo-100 rounded-2xl px-4 md:px-6 py-3 md:py-4 max-w-full md:max-w-lg text-indigo-900 font-medium shadow-sm wrap-break-words">
              Hey! I'm Avila, your AI language teacher. Ask me anything or choose a topic below:
            </div>

            {/* TOPIC BUTTONS */}
            <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
              <TopicButton label={`What is ${topic}`} />
              <TopicButton label={`How to code in ${topic}`} />
              <TopicButton label={`Why is ${topic} important?`} />
            </div>
          </article>

          {/* INPUT */}
          <footer className="p-3 md:p-4 flex items-center gap-3 md:gap-4 bg-white border-t border-gray-200 shadow-inner">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 md:px-5 py-2 md:py-3 outline-none text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm transition"
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
            <button
              aria-label="Send voice message"
              className={`w-12 md:w-14 h-12 md:h-14 bg-indigo-50 rounded-full flex items-center justify-center shadow-sm hover:bg-indigo-200 active:scale-95 transition-transform duration-150 ${
                message.trim() === "" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleSend}
              type="button"
              disabled={message.trim() === ""}
            >
              <Mic size={20} className="text-indigo-700" />
            </button>
          </footer>
        </section>

        {/* FEEDBACK PANEL */}
        <aside className="w-full lg:w-80 self-center bg-white rounded-2xl flex flex-col items-center justify-center text-center shadow-lg p-4 md:p-6 select-none mt-4 lg:mt-0">
          <div className="flex mb-3 gap-2 md:gap-3">
            <StatusDot color="bg-green-500" />
            <StatusDot color="bg-orange-400" />
            <StatusDot color="bg-gray-300" />
            <StatusDot color="bg-gray-300" />
          </div>
          <h3 className="font-bold mb-2 text-indigo-900 text-base md:text-lg">Get feedback on messages</h3>
          <p className="text-xs md:text-sm text-indigo-600 leading-relaxed">
            AI will analyze your messages and give personalized feedback to improve your skills.
          </p>
        </aside>

      </main>
    </div>
  );
}

function TopicButton({ label }) {
  return (
    <button
      type="button"
      className="px-3 md:px-6 py-1.5 md:py-2 rounded-full border-2 border-indigo-600 text-indigo-700 font-medium shadow-sm hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-xs md:text-sm"
    >
      {label}
    </button>
  );
}

function StatusDot({ color }) {
  return <span className={`w-6 md:w-8 h-6 md:h-8 rounded-full ${color} shadow-sm`} aria-hidden="true" />;
}