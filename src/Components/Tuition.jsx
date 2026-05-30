import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const STEPS = [
  { id: "Beginner" },
  { id: "Intermediate" },
  { id: "Advanced" },
];

const iconColor = {
  PDF: "text-red-500",
  VIDEO: "text-purple-600",
  NOTES: "text-green-600",
};

const studentImages = [
  "https://i.pinimg.com/1200x/15/e1/84/15e1844da2ab31663a95513728413d0e.jpg",
  "https://i.pinimg.com/736x/75/84/9d/75849d706be1d5137f440f1d80897d89.jpg",
  "https://images.unsplash.com/photo-1590642912806-dc81a8b6a329?crop=entropy&cs=tinysrgb&fit=crop&h=150&w=150",
];

export default function Tuition() {
  const { t } = useTranslation();

  const [active, setActive] = useState("Beginner");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-b from-white via-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 mb-3">
            {t("tuition.header.tag")}
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {t("tuition.header.title")}
          </h2>

          <p className="text-gray-600 text-lg sm:text-xl">
            {t("tuition.header.subtitle")}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

          {/* STEPS */}
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-2">
            {STEPS.map((step) => {
              const isActive = step.id === active;

              return (
                <button
                  key={step.id}
                  onClick={() => setActive(step.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition min-w-max ${
                    isActive ? "bg-blue-50 shadow-md" : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-full border ${
                      isActive ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isActive ? "bg-white" : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <span
                    className={`font-medium ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {t(`tuition.steps.${step.id}.label`)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PREVIEW */}
          <div className="rounded-3xl bg-white shadow p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >

                {/* CONVERSATION BUBBLES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex gap-4 items-start">
                    <img src={studentImages[0]} className="w-16 h-16 rounded-xl object-cover" />

                    <div className="bg-yellow-400/20 text-gray-900 px-4 py-3 rounded-2xl max-w-sm font-medium shadow-sm">
                      {t(`tuition.steps.${active}.leftBubble`)}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 items-start">
                    <div className="bg-indigo-900 text-white px-4 py-3 rounded-2xl max-w-sm font-medium shadow-sm">
                      {t(`tuition.steps.${active}.rightBubble`)}
                      <div className="text-xs text-indigo-300 mt-1">
                        {t("tuition.example")}
                      </div>
                    </div>

                    <img src={studentImages[1]} className="w-16 h-16 rounded-xl object-cover" />
                  </div>
                </div>

                {/* LEARNING METHODS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                  {["pdf", "video", "notes"].map((type, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 text-center shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100"
                    >
                      <div className="text-4xl mb-3">
                        <ion-icon
                          name={
                            type === "pdf"
                              ? "document-text-outline"
                              : type === "video"
                              ? "videocam-outline"
                              : "book-outline"
                          }
                          class={iconColor[type.toUpperCase()]}
                        />
                      </div>

                      <h4 className="font-semibold text-gray-900">
                        {t(`tuition.cards.${type}.title`)}
                      </h4>

                      <p className="text-gray-500 text-sm mt-1">
                        {t(`tuition.cards.${type}.desc`)}
                      </p>
                    </div>
                  ))}

                </div>

                {/* CTA */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setOpenModal(true)}
                    className="bg-indigo-600 text-white font-semibold px-8 py-2 cursor-pointer rounded-full shadow-lg hover:bg-indigo-700 transition text-lg"
                  >
                    {t("tuition.cta")}
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>

              <div className="p-8 text-center border-b border-gray-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                  {t(`tuition.steps.${active}.label`)}
                </span>

                <h3 className="text-3xl font-bold text-gray-900">
                  {t(`tuition.steps.${active}.title`)}
                </h3>

                <p className="mt-2 text-gray-500 text-base max-w-lg mx-auto">
                  Structured lessons based on real conversations. PDFs, videos, and notes included.
                </p>
              </div>

              <div className="p-8 space-y-6">

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="line-through text-gray-400">49$</span>
                    <p className="text-3xl font-bold text-green-600">Up to 50% OFF</p>
                  </div>

                  <button
                    onClick={() => navigate("/tuition/learning")}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 font-semibold text-lg w-full sm:w-auto"
                  >
                    {t("tuition.continue")}
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}