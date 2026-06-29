import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Globe,
  Building2,
  Layers,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import { teacherService } from "../Admin/services/teacherService";
import TeacherSidebar from "./components/TeacherSidebar";

export default function TeacherDashboard() {

  const [active, setActive] = useState("dashboard");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCourseId, setActiveCourseId] = useState(null);
  const [chapterData, setChapterData] = useState({ title: "", order_index: 1, description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

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

  const totalStudents = courses.reduce((acc, c) => acc + (c.students_count || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      <TeacherSidebar active={active} setActive={setActive} />

      <main className="flex-1 md:ml-28 p-6 md:p-10 space-y-8">

        <h1 className="text-2xl md:text-3xl font-bold capitalize">
          {active === "dashboard" ? "My Teaching Dashboard" : active}
        </h1>

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

        {active === "courses" && (
          <div className="text-gray-400">My Courses section — à construire</div>
        )}

        {active === "settings" && (
          <div className="text-gray-400">Settings section — à construire</div>
        )}

      </main>

    </div>
  );
}