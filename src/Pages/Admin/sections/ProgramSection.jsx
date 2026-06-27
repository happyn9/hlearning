import { useState } from "react";

import {
  Layers,
  Code2,
  FileText,
  Sparkles
} from "lucide-react";

import SectionCard from "../components/SectionCard";
import { adminService } from "../services/adminService";

import toast from "react-hot-toast";

export default function ProgramsSection({
  setPrograms
}) {

  /* ================= STATE ================= */
  const [programData, setProgramData] = useState({
  title: "",
  code: "",
  description: "",
  category: "IT",
  language: ""
});

  const [loading, setLoading] = useState(false);

  /* ================= UPDATE FIELD ================= */
  const updateField = (key, value) => {

    setProgramData((prev) => ({
      ...prev,
      [key]: value
    }));

  };

  /* ================= CREATE PROGRAM ================= */
  const handleCreateProgram = async () => {

    if (
      !programData.title.trim() ||
      !programData.code.trim()
    ) {

      return toast.error(
        "Please complete required fields"
      );

    }

    try {

      setLoading(true);

      // ✅ FIX: adminService.createProgram retourne déjà la donnée
      // brute (interceptor axios fait response.data en interne).
      // res.data était donc toujours undefined.
      const res =
        await adminService.createProgram(
          programData
        );

      /* UPDATE LOCAL PROGRAMS */
      setPrograms((prev) => [
        ...prev,
        res
      ]);

      /* SUCCESS */
      toast.success(
        "Program created successfully"
      );

      /* RESET FORM */
      setProgramData({
        title: "",
        code: "",
        description: ""
      });

    } catch (err) {

        console.log(err);

        // ✅ FIX: l'intercepteur de api.js rejette déjà avec
        // un objet Error standard contenant .message — pas de
        // err.response ici puisqu'il a déjà été transformé.
        toast.error(
         err?.message ||
         "Failed to create program"
        );

    } finally {

      setLoading(false);

    }

  };

  return (

    <SectionCard
      title="Create Program"
      onAdd={handleCreateProgram}
      loading={loading}
    >

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ================= LEFT ================= */}
        <div className="space-y-5">

          {/* TITLE */}
          <div>

            <label className="label">
              Program Title
            </label>

            <div className="relative">

              <Layers
                size={18}
                className="input-icon"
              />

              <input
                value={programData.title}
                placeholder="Software Engineering"
                className="input pl-11"
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* CODE */}
          <div>

            <label className="label">
              Program Code
            </label>

            <div className="relative">

              <Code2
                size={18}
                className="input-icon"
              />

              <input
                value={programData.code}
                placeholder="SE"
                className="input pl-11 uppercase"
                onChange={(e) =>
                  updateField(
                    "code",
                    e.target.value.toUpperCase()
                  )
                }
              />

              

            </div>

            <p className="text-xs text-gray-400 mt-2">
              Short unique code for the program
            </p>

          </div>
<div>
  <label className="label">Category</label>
  <select
    value={programData.category}
    className="input"
    onChange={(e) => {
      updateField("category", e.target.value);
      if (e.target.value === "IT") updateField("language", "");
    }}
  >
    <option value="IT">Informatique</option>
    <option value="LANGUAGE">Langue</option>
  </select>
</div>

{/* LANGUAGE — visible seulement si category === "LANGUAGE" */}
{programData.category === "LANGUAGE" && (
  <div>
    <label className="label">Language</label>
    <select
      value={programData.language}
      className="input"
      onChange={(e) => updateField("language", e.target.value)}
    >
      <option value="">Select language</option>
      <option value="en">Anglais</option>
      <option value="fr">Français</option>
    </select>
  </div>
)}
        </div>
        
        
        {/* ================= RIGHT ================= */}
        <div className="space-y-5">


          {/* DESCRIPTION */}
          <div>

            <label className="label">
              Description
            </label>

            <div className="relative">

              <FileText
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                rows={7}
                value={programData.description}
                placeholder="Describe the academic program, objectives, skills and career opportunities..."
                className="input resize-none pl-11"
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= PREVIEW ================= */}
      <div className="mt-8 bg-linear-to-br from-lime-500/10 to-emerald-500/10 border border-lime-500/20 rounded-3xl p-6">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-12 h-12 rounded-2xl bg-lime-500/20 flex items-center justify-center text-lime-400">

            <Sparkles size={22} />

          </div>

          <div>

            <h3 className="font-semibold text-white">
              {programData.title || "Academic Program"}
            </h3>

            <p className="text-sm text-gray-400">
              Structured learning pathway
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {/* CODE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Program Code
            </p>

            <h4 className="text-lg font-semibold text-white">
              {programData.code || "N/A"}
            </h4>

          </div>

          {/* ACCESS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Access
            </p>

            <h4 className="text-lg font-semibold text-white">
              Student Platform
            </h4>

          </div>

        </div>

        {/* DESCRIPTION */}
        {programData.description && (

          <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
              Description Preview
            </p>

            <p className="text-sm text-gray-300 leading-relaxed">
              {programData.description}
            </p>

          </div>

        )}

      </div>

    </SectionCard>

  );
}