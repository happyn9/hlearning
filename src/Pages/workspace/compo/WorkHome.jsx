import { useEffect, useState } from "react";
import api from "../../../services/api";
import { motion } from "framer-motion";

import {
  Sparkles,
  Brain,
  BookOpen,
  Trophy,
  Users,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function WorkHome({ workspace }) {
  const [reco, setReco] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReco = async () => {
      try {
        const data = await api.get("/recommendations/home");
        setReco(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReco();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 lg:px-12 py-10 space-y-14">

      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[48px] bg-white border border-white/60 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.25)]"
      >
        <div className="grid lg:grid-cols-2 min-h-[620px]">

          {/* LEFT */}
          <div className="flex flex-col justify-center px-10 lg:px-20 py-16">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-black text-xs font-medium w-fit mb-8 backdrop-blur-xl">
              <Sparkles size={14} />
              AI Powered Workspace
            </div>

            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F] leading-[1.05]">
              {workspace?.name || "H-learning"}
            </h1>

            <p className="mt-6 text-lg text-[#6E6E73] max-w-xl leading-relaxed">
              {workspace?.description ||
                "A next-generation learning experience powered by AI with Apple-level design precision."}
            </p>

            <div className="flex gap-4 mt-10">
              <button className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-105 active:scale-95 transition">
                Start Learning
              </button>

              <button className="px-6 py-3 rounded-full bg-white border border-black/10 text-black text-sm font-medium hover:bg-[#F2F2F2] transition">
                Explore Workspace
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center justify-center">

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[360px] rounded-[40px] bg-white/60 backdrop-blur-2xl border border-white shadow-2xl p-6"
            >
              <div className="h-[200px] rounded-3xl bg-gradient-to-br from-black via-zinc-800 to-zinc-600 flex items-center justify-center">
                <Bot size={78} className="text-white" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#1D1D1F]">
                AI Learning Assistant
              </h3>

              <p className="mt-2 text-sm text-[#6E6E73]">
                Adaptive intelligence guiding your learning journey in real time.
              </p>

              {/* pulse bar */}
              <div className="mt-6 h-1 w-full bg-[#F0F0F5] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1 }}
                />
              </div>

              <p className="text-xs text-[#6E6E73] mt-2">
                AI is analyzing your progress...
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard icon={<BookOpen size={18} />} title="Courses" value="24" delay={0.1} />
        <StatCard icon={<Brain size={18} />} title="AI Sessions" value="178" delay={0.2} />
        <StatCard icon={<Users size={18} />} title="Learners" value="1.2K" delay={0.3} />
        <StatCard icon={<Trophy size={18} />} title="Certificates" value="96" delay={0.4} />

      </div>

      {/* ================= RECOMMENDATIONS ================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] border border-white/60 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.2)] p-10"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-[#1D1D1F]">
              Recommended for You
            </h2>

            <p className="text-[#6E6E73] mt-2">
              {reco?.message}
            </p>

            {reco?.encouragement && (
              <p className="text-black mt-3 text-sm font-medium">
                {reco.encouragement}
              </p>
            )}
          </div>

          <button className="flex items-center gap-2 text-sm font-medium text-black hover:opacity-60 transition">
            View All <ArrowRight size={16} />
          </button>
        </div>

        {/* BODY */}
        {loading ? (
          <SkeletonCard />
        ) : reco?.course ? (
          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RecommendationCard
                title={reco.course.title}
                progress={Math.floor(Math.random() * 60) + 20}
              />
            </motion.div>

          </div>
        ) : (
          <div className="mt-10 p-6 rounded-3xl bg-[#F5F5F7] text-[#6E6E73]">
            No course found for your program ({reco?.program})
          </div>
        )}

      </motion.section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, title, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-3xl border border-white shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className="text-black">{icon}</div>
      <p className="text-[#6E6E73] text-sm mt-4">{title}</p>
      <h3 className="text-2xl font-semibold text-[#1D1D1F] mt-1">
        {value}
      </h3>
    </motion.div>
  );
}

function RecommendationCard({ title, progress }) {
  return (
    <div className="bg-white rounded-3xl border border-white shadow-sm p-6 hover:shadow-xl transition">

      <h3 className="font-semibold text-[#1D1D1F]">{title}</h3>

      <div className="h-1.5 bg-[#F0F0F5] rounded-full mt-5 overflow-hidden">
        <motion.div
          className="h-full bg-black rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <p className="mt-3 text-sm text-[#6E6E73]">
        {progress}% completed
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="mt-10 grid md:grid-cols-3 gap-6">
      <div className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
      <div className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
      <div className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
    </div>
  );
}