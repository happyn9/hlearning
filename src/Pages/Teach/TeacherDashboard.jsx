import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Users,
  Globe,
  Building2,
  Layers,
  Plus,
  Sparkles,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

import { teacherService } from "../Admin/services/teacherService";
import TeacherSidebar from "./sections/TeacherSidebar";

const AI_QUICK_PROMPTS = [
  { emoji: "📝", label: "Lesson plan",      prompt: "Create a B1 lesson plan on business emails (45 min)" },
  { emoji: "💬", label: "Exercise",          prompt: "Write a fill-in-the-blank exercise on past tense for A2 learners" },
  { emoji: "🎯", label: "CEFR adaptation",  prompt: "Adapt this text to B2 level: " },
  { emoji: "📊", label: "Quiz",             prompt: "Generate 5 MCQ questions on English conditionals (B1)" },
];

const SYSTEM_PROMPT = `You are an expert English language teaching assistant on an e-learning platform called hLearning.
You help teachers create lesson plans, exercises (fill-in-the-blank, MCQ, dialogues, role-plays), quizzes, and adapt content to CEFR levels (A1–C2).
Always respond in the same language the teacher uses (French or English).
Keep answers structured, practical, and ready to use in a classroom or online setting.`;

export default function TeacherDashboard() {

  const [active, setActive] = useState("dashboard");

  // --- Dashboard state ---
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [chapterData, setChapterData] = useState({ title: "", order_index: 1, description: "" });
  const [submitting, setSubmitting] = useState(false);

  // --- AI state ---
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your AI teaching assistant 👋\nI can help you write lesson plans, exercises, quizzes, or adapt any content to a specific CEFR level (A1–C2). What do you need today?",
    },
  ]);
  const [aiInput, setAiInput]     = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef             = useRef(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, aiLoading]);

  // ─── Dashboard ────────────────────────────────────────────
  async function loadDashboard() {
    setLoading(true);
    try {
      const data = await teacherService.getDashboard();
      setCourses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Failed to load your dashboard");
    } finally {
      setLoading(false);
    }
  }

  function updateChapterField(key, value) {
    setChapterData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmitChapter() {
    if (!activeCourseId) return toast.error("Select a course first");
    if (!chapterData.title.trim()) return toast.error("Chapter title is required");

    setSubmitting(true);
    try {
      await teacherService.submitChapter(activeCourseId, chapterData);
      toast.success("Chapter submitted for review");
      setChapterData({ title: "", order_index: 1, description: "" });
      setActiveCourseId(null);
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Failed to submit chapter");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── AI assistant ─────────────────────────────────────────
  async function handleAiSend() {
    const userText = aiInput.trim();
    if (!userText || aiLoading) return;

    const updatedMessages = [...aiMessages, { role: "user", text: userText }];
    setAiMessages(updatedMessages);
    setAiInput("");
    setAiLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedMessages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const reply =
        data.content
          ?.filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("\n") || "No response received.";

      setAiMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      console.error(e);
      toast.error("AI error: " + (e?.message || "Unknown error"));
    } finally {
      setAiLoading(false);
    }
  }

  function handleQuickPrompt(prompt) {
    setAiInput(prompt);
  }

  // ─── Derived ──────────────────────────────────────────────
  const totalStudents = courses.reduce((acc, c) => acc + (c.students_count || 0), 0);

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      <TeacherSidebar active={active} setActive={setActive} />

      <main className="flex-1 md:ml-28 p-6 md:p-10 space-y-8">

        <h1 className="text-2xl md:text-3xl font-bold capitalize">
          {active === "dashboard" && "My Teaching Dashboard"}
          {active === "courses"   && "My Courses"}
          {active === "ai"        && "AI Teaching Assistant"}
          {active === "settings"  && "Settings"}
        </h1>

        {/* ── DASHBOARD ── */}
        {active === "dashboard" && (
          <>
            {/* STAT CARDS */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-500/20 flex items-center justify-center text-lime-400">
                  <BookOpen size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Courses</p>
                  <p className="text-2xl font-bold">{loading ? "…" : courses.length}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold">{loading ? "…" : totalStudents}</p>
                </div>
              </div>
            </div>

            {/* COURSES LIST */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 rounded-full border-2 border-lime-500/30 border-t-lime-500 animate-spin" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center text-gray-400 py-16 bg-white/5 border border-white/10 rounded-3xl">
                <Layers size={28} className="mx-auto mb-3" />
                You haven't been assigned to any course yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.course_id}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            {course.delivery_mode === "online" ? (
                              <Globe size={12} />
                            ) : (
                              <Building2 size={12} />
                            )}
                            {course.delivery_mode}
                          </span>
                          {course.center && (
                            <span className="flex items-center gap-1">
                              <Building2 size={12} /> {course.center.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm bg-lime-500/10 text-lime-400 px-3 py-1.5 rounded-xl">
                        <Users size={14} />
                        {course.students_count}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setActiveCourseId(
                          activeCourseId === course.course_id ? null : course.course_id
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-2.5 text-sm transition"
                    >
                      <Plus size={16} />
                      {activeCourseId === course.course_id ? "Cancel" : "Submit a chapter"}
                    </button>

                    {activeCourseId === course.course_id && (
                      <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div>
                          <label className="text-xs text-gray-400">Chapter Title</label>
                          <input
                            value={chapterData.title}
                            placeholder="Introduction to Variables"
                            className="input mt-1"
                            onChange={(e) => updateChapterField("title", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-400">Description</label>
                          <textarea
                            value={chapterData.description}
                            rows={2}
                            placeholder="Short description..."
                            className="input mt-1 resize-none"
                            onChange={(e) => updateChapterField("description", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-400">Order Index</label>
                          <input
                            type="number"
                            value={chapterData.order_index}
                            className="input mt-1"
                            onChange={(e) =>
                              updateChapterField("order_index", Number(e.target.value))
                            }
                          />
                        </div>

                        <button
                          onClick={handleSubmitChapter}
                          disabled={submitting}
                          className="w-full bg-lime-500 text-black font-medium py-2.5 rounded-xl hover:bg-lime-400 transition disabled:opacity-50"
                        >
                          {submitting ? "Submitting..." : "Submit for review"}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                          Your chapter will be reviewed by an admin before going live.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── COURSES ── */}
        {active === "courses" && (
          <div className="text-gray-400">My Courses section — à construire</div>
        )}

        {/* ── AI ASSISTANT ── */}
        {active === "ai" && (
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Header badge */}
            <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shrink-0">
                <Sparkles size={15} />
              </div>
              <p className="text-sm text-gray-300">
                Powered by Claude · Generates lesson plans, exercises, quizzes and CEFR adaptations
              </p>
            </div>

            {/* Quick prompt cards */}
            <div className="grid grid-cols-2 gap-3">
              {AI_QUICK_PROMPTS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleQuickPrompt(s.prompt)}
                  className="bg-white/5 hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/30 rounded-2xl p-4 text-left transition"
                >
                  <span className="text-xl">{s.emoji}</span>
                  <p className="text-sm font-semibold mt-1">{s.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{s.prompt}</p>
                </button>
              ))}
            </div>

            {/* Chat window */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4 max-h-[52vh] overflow-y-auto">
              {aiMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={13} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                      m.role === "assistant"
                        ? "bg-violet-500/10 text-gray-200 rounded-tl-none"
                        : "bg-white/10 text-white rounded-tr-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {aiLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shrink-0">
                    <Sparkles size={13} />
                  </div>
                  <div className="bg-violet-500/10 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex gap-3">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSend();
                  }
                }}
                placeholder="Ask anything about your teaching…"
                className="input flex-1"
              />
              <button
                onClick={handleAiSend}
                disabled={aiLoading || !aiInput.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-2xl px-4 flex items-center justify-center transition"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Press Enter to send · Shift+Enter for a new line
            </p>

          </div>
        )}

        {/* ── SETTINGS ── */}
        {active === "settings" && (
          <div className="text-gray-400">Settings section — à construire</div>
        )}

      </main>
    </div>
  );
}