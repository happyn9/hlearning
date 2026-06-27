import {
  BookOpen,
  PlayCircle,
  FileVideo,
  Clock3,
  Eye,
  Layers,
  Plus,
  Link2
} from "lucide-react";

import SectionCard from "../components/SectionCard";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function ContentSection({
  chapters,
  setChapterData,
  setLessonData,
  onAddChapter,
  onAddLesson
}) {
  const [courses,setCourses]=useState([])
  const updateChapter = (key, value) => {
    setChapterData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    // ✅ api.get retourne déjà la donnée brute (response.data via interceptor)
    api.get("/admin/courses")
     .then((data) => setCourses(Array.isArray(data) ? data : []))
     .catch(console.log);
  }, []);

  const updateLesson = (key, value) => {
    setLessonData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="grid xl:grid-cols-2 gap-6">

      {/* ================= CHAPTER SECTION ================= */}
      <SectionCard
        title="Add Chapter"
        onAdd={onAddChapter}
      >

        <div className="space-y-5">

          {/* COURSE */}
          <div>
            <label className="label">
              Select Course
            </label>

            <div className="relative">

              <BookOpen
                size={18}
                className="input-icon"
              />

              <select
                className="input pl-11"
                onChange={(e)=>
                  updateChapter(
                    "course_id",
                    e.target.value
                  )
                }
              >

                <option>
                  Select Course
                </option>

                {courses.map((c)=>(
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.title}
                  </option>
                ))}

              </select>

            </div>
          </div>

          {/* CHAPTER TITLE */}
          <div>
            <label className="label">
              Chapter Title
            </label>

            <div className="relative">

              <Layers
                size={18}
                className="input-icon"
              />

              <input
                placeholder="Introduction to React"
                className="input pl-11"
                onChange={(e)=>
                  updateChapter(
                    "title",
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          {/* CHAPTER ORDER */}
          <div>
            <label className="label">
              Chapter Order
            </label>

            <input
              type="number"
              placeholder="1"
              className="input"
              onChange={(e)=>
                updateChapter(
                  "order_index",
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* PREVIEW CARD */}
          <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <BookOpen size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Course Chapter
                </h3>

                <p className="text-sm text-gray-400">
                  Organize lessons and learning flow
                </p>
              </div>

            </div>

          </div>

        </div>

      </SectionCard>

      {/* ================= LESSON SECTION ================= */}
      <SectionCard
        title="Add Lesson"
        onAdd={onAddLesson}
      >

        <div className="space-y-5">

          {/* LESSON TITLE */}
          <div>
            <label className="label">
              Lesson Title
            </label>

            <div className="relative">

              <PlayCircle
                size={18}
                className="input-icon"
              />

              <input
                placeholder="Understanding Components"
                className="input pl-11"
                onChange={(e)=>
                  updateLesson(
                    "title",
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          {/* CHAPTER */}
          <div>
            <label className="label">
              Select Chapter
            </label>

            <select
              className="input"
              onChange={(e)=>
                updateLesson(
                  "chapter_id",
                  e.target.value
                )
              }
            >

              <option>
                Select Chapter
              </option>

              {chapters.map((ch)=>(
                <option
                  key={ch.id}
                  value={ch.id}
                >
                  {ch.title}
                </option>
              ))}

            </select>
          </div>

          {/* LESSON TYPE */}
          <div>
            <label className="label">
              Lesson Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={()=>
                  updateLesson(
                    "type",
                    "video"
                  )
                }
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition text-left"
              >

                <FileVideo
                  size={20}
                  className="mb-3 text-red-400"
                />

                <h3 className="font-medium text-white">
                  Video Lesson
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Upload or embed video
                </p>

              </button>

              <button
                type="button"
                onClick={()=>
                  updateLesson(
                    "type",
                    "pdf"
                  )
                }
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition text-left"
              >

                <BookOpen
                  size={20}
                  className="mb-3 text-emerald-400"
                />

                <h3 className="font-medium text-white">
                  PDF Lesson
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Documents & notes
                </p>

              </button>

            </div>
          </div>

          {/* VIDEO URL */}
          <div>
            <label className="label">
              Video / File URL
            </label>

            <div className="relative">

              <Link2
                size={18}
                className="input-icon"
              />

              <input
                placeholder="https://..."
                className="input pl-11"
                onChange={(e)=>
                  updateLesson(
                    "video_url",
                    e.target.value
                  )
                }
              />

            </div>
          </div>
          {/* PDF URL */}
<div>
  <label className="label">
    PDF URL (optional, can be combined with video)
  </label>

  <div className="relative">
    <Link2 size={18} className="input-icon" />
    <input
      placeholder="https://.../document.pdf"
      className="input pl-11"
      onChange={(e) =>
        updateLesson("pdf_url", e.target.value)
      }
    />
  </div>
</div>

          {/* EXTRA FIELDS */}
          <div className="grid grid-cols-2 gap-4">

            {/* DURATION */}
            <div>
              <label className="label">
                Duration (sec)
              </label>

              <div className="relative">

                <Clock3
                  size={18}
                  className="input-icon"
                />

                <input
                  type="number"
                  placeholder="600"
                  className="input pl-11"
                  onChange={(e)=>
                    updateLesson(
                      "duration_seconds",
                      Number(e.target.value)
                    )
                  }
                />

              </div>
            </div>

            {/* ORDER */}
            <div>
              <label className="label">
                Order Index
              </label>

              <input
                type="number"
                placeholder="1"
                className="input"
                onChange={(e)=>
                  updateLesson(
                    "order_index",
                    Number(e.target.value)
                  )
                }
              />
            </div>

          </div>

          {/* PREVIEW */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Eye size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Free Preview
                </h3>

                <p className="text-sm text-gray-400">
                  Allow public preview access
                </p>
              </div>

            </div>

            <label className="relative inline-flex items-center cursor-pointer">

              <input
                type="checkbox"
                className="sr-only peer"
                onChange={(e)=>
                  updateLesson(
                    "is_preview",
                    e.target.checked
                  )
                }
              />

              <div className="w-12 h-6 bg-neutral-700 rounded-full peer peer-checked:bg-lime-500 transition" />

              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6" />

            </label>

          </div>

        </div>

      </SectionCard>

    </div>
  );
}