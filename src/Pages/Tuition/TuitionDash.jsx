import {
  MessageSquare,
  Video,
  GraduationCap,
  Brain,
  Bell,
  Youtube,
  MapPin,
  Phone,
} from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChatPage from "./ChatPage";

export default function TuitionDash() {
  const { t } = useTranslation();

  const [chat, setChat] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [video, setVideo] = useState(null);

  const tools = [
    {
      titleKey: "tuitionDash.tools.youtube",
      type: "video",
      videoId: "dQw4w9WgXcQ",
    },
    {
      titleKey: "tuitionDash.tools.chat",
      type: "chat",
    },
    {
      titleKey: "tuitionDash.tools.ai",
      type: "ai",
    },
    {
      titleKey: "tuitionDash.tools.french",
      type: "video",
      videoId: "3JZ_D3ELwOQ",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#f2f2f7] text-black">

      {/* TOP BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-end">

          <div className="flex items-center gap-4">
            <Bell size={18} />
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
              H
            </div>
          </div>

        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="md:fixed md:flex hidden md:left-6 md:top-24 md:flex-col gap-4 bg-white/70 backdrop-blur-xl border border-gray-200 p-3 rounded-2xl shadow-lg">

        <AppleIcon icon={<Brain size={18} />} />
        <AppleIcon icon={<MessageSquare size={18} />} onClick={() => setChat(true)} />
        <AppleIcon icon={<Youtube size={18} />} />
        <AppleIcon icon={<Video size={18} />} />
        <AppleIcon icon={<GraduationCap size={18} />} />

      </aside>
      {/* Mobile */}
      <aside className="md:hidden bottom-0 justify-center left-10 flex fixed md:flex-col gap-4 bg-white/70 backdrop-blur-xl border border-gray-200 p-3 rounded-2xl shadow-lg">

        <AppleIcon icon={<Brain size={18} />} />
        <AppleIcon icon={<MessageSquare size={18} />} onClick={() => setChat(true)} />
        <AppleIcon icon={<Youtube size={18} />} />
        <AppleIcon icon={<Video size={18} />} />
        <AppleIcon icon={<GraduationCap size={18} />} />

      </aside>

      {/* MAIN */}
      <main className="pt-24 px-6 max-w-6xl mx-auto">

        {/* HERO */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">
            {t("tuitionDash.hero.title")}
          </h1>
          <p className="text-gray-500 mt-2">
            {t("tuitionDash.hero.subtitle")}
          </p>
        </div>

        {/* PREMIUM */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <PremiumCard
            title={t("tuitionDash.plans.freeTitle")}
            desc={t("tuitionDash.plans.freeDesc")}
            icon={<Youtube />}
          />

          <PremiumCard
            title={t("tuitionDash.plans.onlineTitle")}
            desc={t("tuitionDash.plans.onlineDesc")}
            icon={<Phone />}
          />

          <PremiumCard
            title={t("tuitionDash.plans.presentielTitle")}
            desc={t("tuitionDash.plans.presentielDesc")}
            icon={<MapPin />}
          />

        </div>

        {/* TOOLS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {tools.map((tool, i) => (
            <div
              key={i}
              onClick={() => {
                if (tool.type === "video") setVideo(tool.videoId);
                if (tool.type === "chat") setChat(true);
              }}
              className="bg-white/70 border border-gray-200 rounded-3xl p-4 hover:shadow-xl transition cursor-pointer"
            >

              <div className="h-28 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                {tool.type === "video" ? (
                  <Youtube size={32} />
                ) : (
                  <Brain size={32} />
                )}
              </div>

              <h3 className="text-sm font-semibold">
                {t(tool.titleKey)}
              </h3>

              <span className="text-xs text-gray-500">
                {tool.type}
              </span>

            </div>
          ))}

        </div>

      </main>

      {/* VIDEO MODAL */}
      {video && (
        <VideoModal videoId={video} onClose={() => setVideo(null)} />
      )}

      {/* CHAT */}
      {chat && <ChatPage onClose={() => setChat(false)} />}

    </div>
  );
}

/* ================= COMPONENTS ================= */

function AppleIcon({ icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer text-gray-600 hover:bg-gray-200 transition"
    >
      {icon}
    </div>
  );
}

function PremiumCard({ title, desc, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{desc}</p>

      <button className="mt-3 text-xs bg-black text-white px-3 py-1 rounded-lg">
        Explore
      </button>
    </div>
  );
}

/* ================= VIDEO MODAL ================= */

function VideoModal({ videoId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">

      <div className="bg-white w-[90%] max-w-4xl rounded-2xl overflow-hidden shadow-2xl">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">
            {t("tuitionDash.video.title")}
          </h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

      </div>

    </div>
  );
}