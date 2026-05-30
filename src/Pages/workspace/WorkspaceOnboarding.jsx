import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import logo from "/src/assets/workspace.png";
import api from "../../services/api";

const steps = ["welcome", "workspace", "finish"];

export default function WorkspaceOnboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ workspaceName: "", description: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [workspaceId, setWorkspaceId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const next = async () => {
    // ✅ validation
    if (step === 1 && form.workspaceName.trim() === "") {
      setErrorMsg("Enter your workspace Name");
      return;
    }

    // ✅ création workspace
    if (step === 1) {
      try {
        const res = await api.post("/workspaces/", {
          name: form.workspaceName,
          description: form.description,
        });

        if (res && res.id) {
          const id = res.id;

          setWorkspaceId(id);
          localStorage.setItem("workspaceId", id);

          // 👉 PAS de navigation ici
          setStep(2);
        }
      } catch (err) {
        console.error("Error creating workspace:", err);
      }
      return;
    }

    setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  // ✅ REDIRECTION UNIQUE ICI
  const enterWorkspace = () => {
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-r from-indigo-300 to-purple-400 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >

          {/* HEADER */}
          <div className="px-10 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-600">
              Create your Workspace
            </h2>
            <span className="text-sm text-gray-400">
              Step {step + 1} of {steps.length}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="flex px-10 gap-3 mt-6">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i <= step ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* BODY */}
          <div className="p-12">
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-10"
                >
                  <img src={logo} className="w-60 mx-auto" />
                  <div>
                    <h3 className="text-3xl font-bold text-slate-600">
                      Welcome to h-workspace
                    </h3>
                    <p className="mt-4 text-gray-600">
                      Create your workspace and start collaborating.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-xl mx-auto space-y-4"
                >
                  <input
                    name="workspaceName"
                    value={form.workspaceName}
                    onChange={handleChange}
                    placeholder="Workspace Name"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Workspace Description"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  <span className="text-rose-400">{errorMsg}</span>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 2 && (
                <motion.div
                  key="finish"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <img src={logo} className="w-40 mx-auto" />
                  <h3 className="text-3xl font-bold text-slate-800">
                    Workspace Ready 🚀
                  </h3>
                </motion.div>
              )}

            </AnimatePresence>

            {/* BUTTONS */}
            <div className="flex justify-between mt-12">
              <button
                onClick={prev}
                disabled={step === 0}
                className="px-4 py-2 text-gray-500 disabled:opacity-40"
              >
                Back
              </button>

              {step === 2 ? (
                <button
                  onClick={enterWorkspace}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl"
                >
                  Enter Workspace
                </button>
              ) : (
                <button
                  onClick={next}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl"
                >
                  Continue
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}