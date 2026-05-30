import { useEffect, useState } from "react";
import {
  BookOpen,
  Image,
  Tag,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2
} from "lucide-react";

import SectionCard from "../components/SectionCard";
import api from "../../../services/api";

export default function CourseSection({
  setCourseData,
  onSubmit
}) {

  const [requirements, setRequirements] = useState([""]);
  const [learning, setLearning] = useState([""]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    api.get("/admin/programs")
     .then(setPrograms)
     .catch(console.log);
  }, []);
  
  /* ================= UPDATE FIELD ================= */
  const updateField = (key, value) => {
    setCourseData(prev => ({
      ...(prev || {}),
      [key]: value
    }));
  };

  /* ================= REQUIREMENTS ================= */
  const updateRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;

    setRequirements(updated);

    updateField(
      "course_requirements",
      updated.filter(v => v && v.trim())
    );
  };

  const addRequirement = () => {
    setRequirements(prev => [...prev, ""]);
  };

  const removeRequirement = (index) => {
    const updated = requirements.filter((_, i) => i !== index);

    setRequirements(updated);

    updateField(
      "course_requirements",
      updated.filter(v => v && v.trim())
    );
  };

  /* ================= LEARNING ================= */
  const updateLearning = (index, value) => {
    const updated = [...learning];
    updated[index] = value;

    setLearning(updated);

    updateField(
      "what_you_will_learn",
      updated.filter(v => v && v.trim())
    );
  };

  const addLearning = () => {
    setLearning(prev => [...prev, ""]);
  };

  const removeLearning = (index) => {
    const updated = learning.filter((_, i) => i !== index);

    setLearning(updated);

    updateField(
      "what_you_will_learn",
      updated.filter(v => v && v.trim())
    );
  };

  return (
    <SectionCard title="Create Course" onAdd={onSubmit}>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ================= LEFT ================= */}
        <div className="space-y-5">

          {/* TITLE */}
          <div>
            <div className="flex pb-3 items-center space-x-1">
              <label className="label py-2">Course Title</label>
              <BookOpen size={18} className="input-icon" />
            </div>

            <input
              placeholder="Advanced React Development"
              className="input py-2 px-4"
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col p-1 gap-2.5">
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Write course description..."
              className="input py-2 px-4 rounded-lg resize-none"
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          {/* PROGRAM */}
          <div className="flex gap-3 p-2">
            <label className="label p-2">Program</label>

            <select
              className="input p-2 cursor-pointer"
              onChange={(e) => {
                const value = e.target.value;
                updateField(
                  "program_id",
                  value ? Number(value) : null
                );
              }}
            >
              <option value="">Select Program</option>

              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <div className="flex items-center gap-2 pb-2">
              <label className="label">Course Image URL</label>
              <Image size={18} className="input-icon" />
            </div>

            <input
              placeholder="https://..."
              className="input mt-2 px-4 py-2"
              onChange={(e) => updateField("image_url", e.target.value)}
            />
          </div>

          {/* TAGS */}
          <div>
            <div className="flex items-center pb-2 gap-3">
              <label className="label">Tags</label>
              <Tag size={18} className="input-icon" />
            </div>

            <input
              placeholder="react,javascript,frontend"
              className="input px-4 py-2"
              onChange={(e) =>
                updateField(
                  "tags",
                  e.target.value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-5">

          {/* PREMIUM */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center">

            <div>
              <h3 className="font-semibold text-white">Premium Course</h3>
              <p className="text-sm text-gray-400 mt-1">
                Enable subscription access
              </p>
            </div>

            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) =>
                updateField("is_premium", e.target.checked)
              }
            />
          </div>

          {/* ORDER */}
          <div>
            <label className="label">Order Index</label>

            <input
              type="number"
              className="input"
              placeholder="0"
              onChange={(e) =>
                updateField(
                  "order_index",
                  e.target.value ? Number(e.target.value) : 0
                )
              }
            />
          </div>

          {/* PRICES */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">

            <div className="flex items-center gap-2">
              <DollarSign size={18} />
              <h3 className="font-semibold">Subscription Pricing</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">

              <input
                type="number"
                placeholder="Daily"
                className="input"
                onChange={(e) =>
                  updateField("daily_price", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Weekly"
                className="input"
                onChange={(e) =>
                  updateField("weekly_price", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Monthly"
                className="input"
                onChange={(e) =>
                  updateField("monthly_price", Number(e.target.value))
                }
              />

            </div>
          </div>

        </div>
      </div>

      {/* ================= REQUIREMENTS ================= */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">

        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <h3 className="font-semibold">Course Requirements</h3>
          </div>

          <button
            onClick={addRequirement}
            className="bg-white text-black px-3 py-2 rounded-xl"
          >
            <Plus size={16} />
          </button>
        </div>

        {requirements.map((req, index) => (
          <div key={index} className="flex gap-3 mb-3">

            <input
              value={req}
              className="input"
              placeholder="Requirement..."
              onChange={(e) =>
                updateRequirement(index, e.target.value)
              }
            />

            <button
              onClick={() => removeRequirement(index)}
              className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>

          </div>
        ))}
      </div>

      {/* ================= LEARNING ================= */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">

        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="font-semibold">What Students Will Learn</h3>
          </div>

          <button
            onClick={addLearning}
            className="bg-white text-black px-3 py-2 rounded-xl"
          >
            <Plus size={16} />
          </button>
        </div>

        {learning.map((item, index) => (
          <div key={index} className="flex gap-3 mb-3">

            <input
              value={item}
              className="input"
              placeholder="Learning outcome..."
              onChange={(e) =>
                updateLearning(index, e.target.value)
              }
            />

            <button
              onClick={() => removeLearning(index)}
              className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>

          </div>
        ))}
      </div>

    </SectionCard>
  );
}